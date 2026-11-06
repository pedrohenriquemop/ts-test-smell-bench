export interface Metric {
  smell: string;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ScoredResult {
  file: string;
  referenceSmells: string[];
  modelSmells: string[];
}

const LITERAL_SMELLS = new Set(["Magic Number", "Hardcoded Literal"]);
export const LITERAL_CATEGORY = "Magic Number/Hardcoded Literal";

/** Magic Number and Hardcoded Literal are scored as one raw-literal category. */
export function evaluationCategory(smell: string): string {
  return LITERAL_SMELLS.has(smell) ? LITERAL_CATEGORY : smell;
}

const round4 = (value: number) => parseFloat(value.toFixed(4));
const ratio = (num: number, den: number) => (den > 0 ? num / den : 0);
/** Same value as 2PR/(P+R), defined as 0 when there are no positives at all. */
const f1Score = (tp: number, fp: number, fn: number) => ratio(2 * tp, 2 * tp + fp + fn);

type Categorize = (smell: string) => string;

function hasCategory(smells: string[], category: string, categorize: Categorize): boolean {
  return smells.some((s) => categorize(s) === category);
}

export function scoreSmell(
  smell: string,
  results: ScoredResult[],
  categorize: Categorize = evaluationCategory,
): Metric {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const result of results) {
    const refHas = hasCategory(result.referenceSmells, smell, categorize);
    const modelHas = hasCategory(result.modelSmells, smell, categorize);
    if (refHas && modelHas) tp++;
    else if (modelHas) fp++;
    else if (refHas) fn++;
    else tn++;
  }

  const precision = ratio(tp, tp + fp);
  const recall = ratio(tp, tp + fn);
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return {
    smell, tp, fp, fn, tn,
    precision: round4(precision),
    recall: round4(recall),
    f1: round4(f1),
  };
}

/** Categories in first-seen order across reference and model labels. */
export function smellCategories(results: ScoredResult[], categorize: Categorize = evaluationCategory): string[] {
  return [...new Set(results.flatMap((r) => [...r.referenceSmells, ...r.modelSmells]).map(categorize))];
}

// ── Aggregates ───────────────────────────────────────────────────────

export interface PRF {
  precision: number;
  recall: number;
  f1: number;
}

export interface Aggregates {
  /** Unweighted mean over categories present in the goldset. */
  macro: PRF;
  /** From TP/FP/FN pooled over all categories. */
  micro: PRF;
  /** Macro F1 weighted by goldset support. */
  weightedF1: number;
  /** Share of tests whose predicted set equals the goldset set. */
  exactMatch: number;
  /** Mean |pred ∩ ref| / |pred ∪ ref| per test (1 when both are empty). */
  meanJaccard: number;
  /** Share of correct (test, category) decisions; 1 − Hamming loss. */
  labelAccuracy: number;
  meanReferenceLabels: number;
  meanPredictedLabels: number;
}

const categorySet = (smells: string[]) => new Set(smells.map(evaluationCategory));

export function aggregate(metrics: Metric[], results: ScoredResult[]): Aggregates {
  const supported = metrics.filter((m) => m.tp + m.fn > 0);
  const mean = (values: number[]) => ratio(values.reduce((a, b) => a + b, 0), values.length);
  const totalSupport = supported.reduce((sum, m) => sum + m.tp + m.fn, 0);
  const tp = metrics.reduce((s, m) => s + m.tp, 0);
  const fp = metrics.reduce((s, m) => s + m.fp, 0);
  const fn = metrics.reduce((s, m) => s + m.fn, 0);
  const correctDecisions = metrics.reduce((s, m) => s + m.tp + m.tn, 0);

  let exact = 0, jaccard = 0, refLabels = 0, predLabels = 0;
  for (const r of results) {
    const ref = categorySet(r.referenceSmells);
    const pred = categorySet(r.modelSmells);
    const intersection = [...pred].filter((s) => ref.has(s)).length;
    const union = new Set([...ref, ...pred]).size;
    if (intersection === union) exact++;
    jaccard += union === 0 ? 1 : intersection / union;
    refLabels += ref.size;
    predLabels += pred.size;
  }

  return {
    macro: {
      precision: round4(mean(supported.map((m) => m.precision))),
      recall: round4(mean(supported.map((m) => m.recall))),
      f1: round4(mean(supported.map((m) => m.f1))),
    },
    micro: {
      precision: round4(ratio(tp, tp + fp)),
      recall: round4(ratio(tp, tp + fn)),
      f1: round4(f1Score(tp, fp, fn)),
    },
    weightedF1: round4(ratio(supported.reduce((s, m) => s + m.f1 * (m.tp + m.fn), 0), totalSupport)),
    exactMatch: round4(ratio(exact, results.length)),
    meanJaccard: round4(ratio(jaccard, results.length)),
    labelAccuracy: round4(ratio(correctDecisions, metrics.length * results.length)),
    meanReferenceLabels: round4(ratio(refLabels, results.length)),
    meanPredictedLabels: round4(ratio(predLabels, results.length)),
  };
}

// ── Bootstrap confidence intervals ───────────────────────────────────

export type Interval = [number, number];

/** Deterministic PRNG so reports are reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function percentile(sorted: number[], p: number): number {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
  return sorted[index];
}

/**
 * 95% percentile-bootstrap intervals for per-category F1 and macro F1,
 * resampling tests with replacement.
 */
export function bootstrapF1(
  results: ScoredResult[],
  categories: string[],
  macroCategories: string[],
  iterations = 1000,
  seed = 42,
): { perSmell: Record<string, Interval>; macroF1: Interval } {
  const random = mulberry32(seed);
  const refFlags = results.map((r) => categories.map((c) => hasCategory(r.referenceSmells, c, evaluationCategory)));
  const predFlags = results.map((r) => categories.map((c) => hasCategory(r.modelSmells, c, evaluationCategory)));
  const macroIndexes = macroCategories.map((c) => categories.indexOf(c));
  const samples: number[][] = categories.map(() => []);
  const macroSamples: number[] = [];

  for (let it = 0; it < iterations; it++) {
    const tp = new Array(categories.length).fill(0);
    const fp = new Array(categories.length).fill(0);
    const fn = new Array(categories.length).fill(0);
    for (let n = 0; n < results.length; n++) {
      const i = Math.floor(random() * results.length);
      for (let c = 0; c < categories.length; c++) {
        if (refFlags[i][c] && predFlags[i][c]) tp[c]++;
        else if (predFlags[i][c]) fp[c]++;
        else if (refFlags[i][c]) fn[c]++;
      }
    }
    const f1s = categories.map((_, c) => f1Score(tp[c], fp[c], fn[c]));
    f1s.forEach((f1, c) => samples[c].push(f1));
    macroSamples.push(ratio(macroIndexes.reduce((s, c) => s + f1s[c], 0), macroIndexes.length));
  }

  const interval = (values: number[]): Interval => {
    const sorted = [...values].sort((a, b) => a - b);
    return [round4(percentile(sorted, 0.025)), round4(percentile(sorted, 0.975))];
  };
  return {
    perSmell: Object.fromEntries(categories.map((c, i) => [c, interval(samples[i])])),
    macroF1: interval(macroSamples),
  };
}

// ── AST gate compliance ──────────────────────────────────────────────

type AstMetrics = Record<string, unknown>;
const num = (value: unknown) => Number(value ?? NaN);

/** Hard rules from the smell catalog under which a smell cannot be present. */
export const AST_GATES: Array<{ smell: string; rule: string; blocks: (m: AstMetrics) => boolean }> = [
  { smell: "Assertion Roulette", rule: "assertionCount ≤ 1", blocks: (m) => num(m.assertionCount) <= 1 },
  { smell: "Conditional Test Logic", rule: "controlFlowCount = 0", blocks: (m) => num(m.controlFlowCount) === 0 },
  {
    smell: "General Fixture",
    rule: "setupHookCount = 0 or beforeEachVarCount = 0",
    blocks: (m) => num(m.setupHookCount) === 0 || num(m.beforeEachVarCount) === 0,
  },
];

export interface GateCompliance {
  smell: string;
  rule: string;
  /** Tests where the rule rules the smell out. */
  gatedTests: number;
  /** Of those, how many the model still labelled with the smell. */
  modelViolations: number;
  /** Of those, how many the goldset labels with the smell. */
  referenceViolations: number;
}

export function gateCompliance(
  results: ScoredResult[],
  astMetricsByFile: Map<string, AstMetrics>,
): GateCompliance[] {
  return AST_GATES.map(({ smell, rule, blocks }) => {
    const gated = results.filter((r) => {
      const metrics = astMetricsByFile.get(r.file);
      return metrics !== undefined && blocks(metrics);
    });
    return {
      smell,
      rule,
      gatedTests: gated.length,
      modelViolations: gated.filter((r) => r.modelSmells.includes(smell)).length,
      referenceViolations: gated.filter((r) => r.referenceSmells.includes(smell)).length,
    };
  });
}

// ── Error analysis ───────────────────────────────────────────────────

export interface ErrorHotspot {
  file: string;
  falsePositives: string[];
  falseNegatives: string[];
}

/** Tests with the most wrong (category) decisions. */
export function errorHotspots(results: ScoredResult[], limit = 10): ErrorHotspot[] {
  return results
    .map((r) => {
      const ref = categorySet(r.referenceSmells);
      const pred = categorySet(r.modelSmells);
      return {
        file: r.file,
        falsePositives: [...pred].filter((s) => !ref.has(s)),
        falseNegatives: [...ref].filter((s) => !pred.has(s)),
      };
    })
    .filter((h) => h.falsePositives.length + h.falseNegatives.length > 0)
    .sort((a, b) =>
      b.falsePositives.length + b.falseNegatives.length - (a.falsePositives.length + a.falseNegatives.length))
    .slice(0, limit);
}

export interface LatencyStats {
  meanSeconds: number;
  medianSeconds: number;
  p90Seconds: number;
  maxSeconds: number;
  totalHours: number;
}

export function latencyStats(latenciesMs: number[]): LatencyStats | null {
  if (latenciesMs.length === 0) return null;
  const sorted = [...latenciesMs].sort((a, b) => a - b);
  const total = sorted.reduce((a, b) => a + b, 0);
  const seconds = (ms: number) => round4(ms / 1000);
  return {
    meanSeconds: seconds(total / sorted.length),
    medianSeconds: seconds(percentile(sorted, 0.5)),
    p90Seconds: seconds(percentile(sorted, 0.9)),
    maxSeconds: seconds(sorted[sorted.length - 1]),
    totalHours: round4(total / 3_600_000),
  };
}

// ── Cross-model helpers ──────────────────────────────────────────────

/** Labels predicted by a strict majority of the runs, per test. */
export function majorityVote(runs: ScoredResult[][]): ScoredResult[] {
  const byFile = runs.map((run) => new Map(run.map((r) => [r.file, r])));
  const commonFiles = runs[0]
    .map((r) => r.file)
    .filter((file) => byFile.every((run) => run.has(file)));
  const required = Math.floor(runs.length / 2) + 1;

  return commonFiles.map((file) => {
    const votes = new Map<string, number>();
    for (const run of byFile) {
      for (const smell of new Set(run.get(file)!.modelSmells)) votes.set(smell, (votes.get(smell) ?? 0) + 1);
    }
    return {
      file,
      referenceSmells: byFile[0].get(file)!.referenceSmells,
      modelSmells: [...votes].filter(([, count]) => count >= required).map(([smell]) => smell),
    };
  });
}

/** Cohen's kappa over every (test, category) decision two runs share. */
export function cohensKappa(a: ScoredResult[], b: ScoredResult[], categories: string[]): number {
  const bByFile = new Map(b.map((r) => [r.file, r]));
  let agree = 0, aYes = 0, bYes = 0, total = 0;
  for (const ra of a) {
    const rb = bByFile.get(ra.file);
    if (!rb) continue;
    for (const c of categories) {
      const x = hasCategory(ra.modelSmells, c, evaluationCategory);
      const y = hasCategory(rb.modelSmells, c, evaluationCategory);
      if (x === y) agree++;
      if (x) aYes++;
      if (y) bYes++;
      total++;
    }
  }
  if (total === 0) return 0;
  const observed = agree / total;
  const expected = (aYes / total) * (bYes / total) + (1 - aYes / total) * (1 - bYes / total);
  return round4(expected === 1 ? 1 : (observed - expected) / (1 - expected));
}
