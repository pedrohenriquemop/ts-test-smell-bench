import * as fs from "fs";
import * as path from "path";
import { PROMPT_VARIANTS, type AnalyzerConfig } from "../config/index.ts";
import { evaluateRun, type RunEvaluation } from "./index.ts";
import {
  aggregate,
  bootstrapF1,
  cohensKappa,
  majorityVote,
  scoreSmell,
  smellCategories,
  type Aggregates,
  type Interval,
  type Metric,
} from "./metrics.ts";
import { badge, ci, escapeHtml, LOW_SUPPORT, page, pct, scoreColor, section, table } from "./html.ts";

interface Contender {
  label: string;
  scored: number;
  invalid: number;
  metrics: Metric[];
  aggregates: Aggregates;
  macroCI: Interval;
  gateViolations: number | null;
  meanLatencySeconds: number | null;
}

const support = (m: Metric) => m.tp + m.fn;

interface RunSetup {
  modelId: string;
  cot: boolean;
  ast: boolean;
  ctx: boolean;
}

/** Reads "llama3.1-8b__standard-noast-ctx" back into its prompt flags. */
function parseSetup(version: string): RunSetup {
  const [modelId, setup = ""] = version.split("__");
  const flags = setup.split("-");
  return {
    modelId,
    cot: setup.startsWith("chain-of-thought"),
    ast: !flags.includes("noast"),
    ctx: !flags.includes("noctx"),
  };
}

const setupLabel = ({ cot, ast, ctx }: RunSetup) =>
  [cot ? "CoT" : "no CoT", ast ? "AST" : "no AST", ...(ctx ? [] : ["no ctx"])].join(", ");

/** The model ID, plus its prompt setup when the same model was run more than once. */
function runLabels(evaluations: RunEvaluation[]): string[] {
  const ids = evaluations.map((e) => e.modelId);
  return evaluations.map((e) =>
    ids.filter((id) => id === e.modelId).length > 1 ? `${e.modelId} (${setupLabel(parseSetup(e.version))})` : e.modelId,
  );
}

function contenderFromRun(evaluation: RunEvaluation, label: string): Contender {
  return {
    label,
    scored: evaluation.results.length,
    invalid: evaluation.invalidFiles.length,
    metrics: evaluation.metrics,
    aggregates: evaluation.aggregates,
    macroCI: evaluation.confidence.macroF1,
    gateViolations: evaluation.gates ? evaluation.gates.reduce((s, g) => s + g.modelViolations, 0) : null,
    meanLatencySeconds: evaluation.latency?.meanSeconds ?? null,
  };
}

function ensembleContender(evaluations: RunEvaluation[]): Contender {
  const voted = majorityVote(evaluations.map((e) => e.results));
  const metrics = smellCategories(voted).map((smell) => scoreSmell(smell, voted));
  const supported = metrics.filter((m) => support(m) > 0).map((m) => m.smell);
  return {
    label: `Majority vote (${Math.floor(evaluations.length / 2) + 1}/${evaluations.length})`,
    scored: voted.length,
    invalid: 0,
    metrics,
    aggregates: aggregate(metrics, voted),
    macroCI: bootstrapF1(voted, metrics.map((m) => m.smell), supported).macroF1,
    gateViolations: null,
    meanLatencySeconds: null,
  };
}

const overlaps = (a: Interval, b: Interval) => a[0] <= b[1] && b[0] <= a[1];

// ── Prompt ablation (CoT × AST per model) ────────────────────────────

interface Scores {
  macro: number;
  micro: number;
}

interface AblationRow {
  modelId: string;
  /** Scores per PROMPT_VARIANTS entry, when that variant was run. */
  variants: Array<Scores | undefined>;
  /** Mean change from switching the flag on, holding the other flag fixed. */
  cotEffect: Scores | null;
  astEffect: Scores | null;
}

const variantKey = (cot: boolean, ast: boolean) => `${cot}|${ast}`;

function flagEffect(byVariant: Map<string, Scores>, flag: "cot" | "ast"): Scores | null {
  const deltas: Scores[] = [];
  for (const other of [true, false]) {
    const on = byVariant.get(flag === "cot" ? variantKey(true, other) : variantKey(other, true));
    const off = byVariant.get(flag === "cot" ? variantKey(false, other) : variantKey(other, false));
    if (on && off) deltas.push({ macro: on.macro - off.macro, micro: on.micro - off.micro });
  }
  if (deltas.length === 0) return null;
  const mean = (key: keyof Scores) => deltas.reduce((s, d) => s + d[key], 0) / deltas.length;
  return { macro: mean("macro"), micro: mean("micro") };
}

/** One row per model that was run with more than one prompt variant. */
function ablationRows(evaluations: RunEvaluation[]): AblationRow[] {
  const byModel = new Map<string, Map<string, Scores>>();
  for (const e of evaluations) {
    const { modelId, cot, ast } = parseSetup(e.version);
    const variants = byModel.get(modelId) ?? new Map<string, Scores>();
    variants.set(variantKey(cot, ast), { macro: e.aggregates.macro.f1, micro: e.aggregates.micro.f1 });
    byModel.set(modelId, variants);
  }

  return [...byModel]
    .filter(([, variants]) => variants.size > 1)
    .map(([modelId, variants]) => ({
      modelId,
      variants: PROMPT_VARIANTS.map((v) => variants.get(variantKey(v.useChainOfThought, v.includeAstMetrics))),
      cotEffect: flagEffect(variants, "cot"),
      astEffect: flagEffect(variants, "ast"),
    }));
}

const signedPct = (value: number) => `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}`;

function ablationSection(rows: AblationRow[]): string {
  if (rows.length === 0) return "";
  const effectCell = (effect: Scores | null) => {
    if (!effect) return "–";
    const color = effect.macro > 0 ? "text-emerald-300" : effect.macro < 0 ? "text-rose-300" : "";
    return `<span class="${color}">${signedPct(effect.macro)}</span> <span class="text-gray-500">/ ${signedPct(effect.micro)}</span>`;
  };
  const tableRows = rows.map((row) => [
    `<b>${escapeHtml(row.modelId)}</b>`,
    ...row.variants.map((s) =>
      s
        ? `<span class="px-2 py-0.5 rounded" style="background:${scoreColor(s.macro)}">${pct(s.macro)}</span> <span class="text-gray-500">/ ${pct(s.micro)}</span>`
        : "–",
    ),
    effectCell(row.cotEffect),
    effectCell(row.astEffect),
  ]);
  return section(
    "Prompt Ablation (CoT × AST)",
    table(
      [
        { label: "Model", align: "left" },
        ...PROMPT_VARIANTS.map((v) => ({
          label: setupLabel({ modelId: "", cot: v.useChainOfThought, ast: v.includeAstMetrics, ctx: true }),
        })),
        { label: "CoT effect", title: "Mean change in F1 points when turning chain-of-thought on" },
        { label: "AST effect", title: "Mean change in F1 points when turning AST metrics on" },
      ],
      tableRows,
      "Each cell is macro F1 / micro F1. Effects are the mean change in F1 points from turning the flag on while the other flag stays fixed (macro / micro).",
    ),
  );
}

function ablationInsights(rows: AblationRow[]): string[] {
  const describe = (flag: string, effects: Array<{ modelId: string; effect: Scores }>) => {
    if (effects.length === 0) return [];
    const helped = effects.filter((e) => e.effect.macro > 0).map((e) => escapeHtml(e.modelId));
    const mean = effects.reduce((s, e) => s + e.effect.macro, 0) / effects.length;
    return [
      `Turning ${flag} on raises macro F1 for ${helped.length} of ${effects.length} model(s)${helped.length ? ` (${helped.join(", ")})` : ""}; the mean effect is ${signedPct(mean)} points.`,
    ];
  };
  const effects = (key: "cotEffect" | "astEffect") =>
    rows.flatMap((r) => (r[key] ? [{ modelId: r.modelId, effect: r[key]! }] : []));
  return [...describe("chain-of-thought", effects("cotEffect")), ...describe("AST metrics", effects("astEffect"))];
}

function crossInsights(models: Contender[], ensemble: Contender | null): string[] {
  const insights: string[] = [];
  const ranked = [...models].sort((a, b) => b.aggregates.macro.f1 - a.aggregates.macro.f1);
  const [best, second] = ranked;

  if (best && second) {
    const conclusive = !overlaps(best.macroCI, second.macroCI);
    insights.push(
      `<b>${escapeHtml(best.label)}</b> has the highest macro F1 (${pct(best.aggregates.macro.f1)}), ahead of ${escapeHtml(second.label)} (${pct(second.aggregates.macro.f1)}). ` +
        (conclusive
          ? "Their 95% confidence intervals do not overlap, so the gap is unlikely to be noise."
          : "Their 95% confidence intervals overlap, so this ranking is not statistically conclusive on this goldset."),
    );
  }

  if (ensemble && best) {
    const bestOf = (score: (c: Contender) => number) => Math.max(...models.map(score));
    const comparisons = [
      { name: "macro F1", score: (c: Contender) => c.aggregates.macro.f1 },
      { name: "micro F1", score: (c: Contender) => c.aggregates.micro.f1 },
      { name: "exact match", score: (c: Contender) => c.aggregates.exactMatch },
    ].map(({ name, score }) => ({ name, value: score(ensemble), delta: score(ensemble) - bestOf(score) }));
    const wins = comparisons.filter((c) => c.delta > 0);
    const losses = comparisons.filter((c) => c.delta <= 0);
    const describe = (list: typeof comparisons) =>
      list.map((c) => `${c.name} ${pct(c.value)} (${c.delta > 0 ? "+" : ""}${pct(c.delta)})`).join(", ");
    insights.push(
      wins.length === 0
        ? `A majority vote of the models does not beat the best single model on any aggregate: ${describe(comparisons)}.`
        : `A majority vote of the models beats the best single model on ${describe(wins)}` +
            (losses.length
              ? `, but not on ${describe(losses)}; voting removes many false positives on frequent smells but drops rare smells that only one model detects.`
              : "."),
    );
  }

  const categories = [...new Set(models.flatMap((m) => m.metrics.map((x) => x.smell)))];
  const hardForAll = categories.filter((smell) => {
    const scores = models.map((m) => m.metrics.find((x) => x.smell === smell));
    const s = scores.find(Boolean);
    return s && support(s) >= LOW_SUPPORT && scores.every((x) => (x?.f1 ?? 0) < 0.3);
  });
  if (hardForAll.length) {
    insights.push(
      `No model reaches 30% F1 on ${hardForAll.map((s) => `<b>${escapeHtml(s)}</b>`).join(", ")}, despite enough goldset cases; these smells are hard for models of this size.`,
    );
  }

  const spread = categories
    .map((smell) => {
      const f1s = models.map((m) => m.metrics.find((x) => x.smell === smell)?.f1 ?? 0);
      return { smell, spread: Math.max(...f1s) - Math.min(...f1s) };
    })
    .sort((a, b) => b.spread - a.spread)[0];
  if (spread && spread.spread >= 0.3) {
    insights.push(
      `The models disagree most on <b>${escapeHtml(spread.smell)}</b>: F1 varies by ${pct(spread.spread)} between the best and worst model.`,
    );
  }

  const fastest = [...models].filter((m) => m.meanLatencySeconds !== null).sort((a, b) => a.meanLatencySeconds! - b.meanLatencySeconds!)[0];
  if (fastest && best && fastest !== best) {
    insights.push(
      `${escapeHtml(fastest.label)} is the fastest (${fastest.meanLatencySeconds!.toFixed(0)} s per test), while ${escapeHtml(best.label)} scores best (${best.meanLatencySeconds?.toFixed(0) ?? "?"} s per test).`,
    );
  }
  return insights;
}

function leaderboard(contenders: Contender[]): string {
  const sorted = [...contenders].sort((a, b) => b.aggregates.macro.f1 - a.aggregates.macro.f1);
  const rows = sorted.map((c, i) => [
    `${i + 1}`,
    `<b>${escapeHtml(c.label)}</b>`,
    `${c.scored}${c.invalid ? ` <span class="text-gray-500">(+${c.invalid} invalid)</span>` : ""}`,
    `<span class="px-2 py-0.5 rounded" style="background:${scoreColor(c.aggregates.macro.f1)}">${pct(c.aggregates.macro.f1)}</span>`,
    ci(c.macroCI),
    pct(c.aggregates.micro.f1),
    pct(c.aggregates.weightedF1),
    pct(c.aggregates.exactMatch),
    pct(c.aggregates.meanJaccard),
    `${c.aggregates.meanPredictedLabels.toFixed(2)} / ${c.aggregates.meanReferenceLabels.toFixed(2)}`,
    c.gateViolations === null ? "–" : String(c.gateViolations),
    c.meanLatencySeconds === null ? "–" : `${c.meanLatencySeconds.toFixed(0)} s`,
  ]);
  return table(
    [
      { label: "#" },
      { label: "Model", align: "left" },
      { label: "Scored tests" },
      { label: "Macro F1" },
      { label: "95% CI" },
      { label: "Micro F1" },
      { label: "Weighted F1" },
      { label: "Exact match" },
      { label: "Jaccard" },
      { label: "Smells/test (pred / gold)" },
      { label: "Gate violations", title: "Predictions the AST hard rules rule out" },
      { label: "Mean latency" },
    ],
    rows,
  );
}

/** One row per smell, one column per contender; the best score per row is outlined. */
function perSmellMatrix(contenders: Contender[], cell: (m: Metric | undefined) => string, value: (m: Metric | undefined) => number): string {
  const supportOf = (smell: string) => {
    const metric = contenders.map((c) => c.metrics.find((m) => m.smell === smell)).find(Boolean);
    return metric ? support(metric) : 0;
  };
  const categories = [...new Set(contenders.flatMap((c) => c.metrics.map((m) => m.smell)))].sort(
    (a, b) => supportOf(b) - supportOf(a) || a.localeCompare(b),
  );
  const rows = categories.map((smell) => {
    const metrics = contenders.map((c) => c.metrics.find((m) => m.smell === smell));
    const best = Math.max(...metrics.map(value));
    const s = supportOf(smell);
    return [
      `${escapeHtml(smell)}${s > 0 && s < LOW_SUPPORT ? badge("low support") : ""}`,
      String(s),
      ...metrics.map((m) => {
        const v = value(m);
        const outline = v === best && v > 0 ? "outline outline-2 outline-emerald-400" : "";
        return `<span class="px-2 py-0.5 rounded ${outline}" style="background:${scoreColor(v)}">${cell(m)}</span>`;
      }),
    ];
  });
  return table(
    [{ label: "Smell", align: "left" }, { label: "Support" }, ...contenders.map((c) => ({ label: c.label }))],
    rows,
  );
}

function agreementMatrix(evaluations: RunEvaluation[], labels: string[]): string {
  const categories = [...new Set(evaluations.flatMap((e) => e.metrics.map((m) => m.smell)))];
  const rows = evaluations.map((a, i) => [
    `<b>${escapeHtml(labels[i])}</b>`,
    ...evaluations.map((b, j) => (i === j ? "–" : cohensKappa(a.results, b.results, categories).toFixed(2))),
  ]);
  return table(
    [{ label: "Cohen's κ", align: "left" }, ...labels.map((label) => ({ label }))],
    rows,
    "Agreement between models over every (test, smell) decision, corrected for chance. Above 0.6 is substantial; below 0.4 is weak.",
  );
}

function gateMatrix(evaluations: RunEvaluation[], labels: string[]): string {
  const withGates = evaluations.filter((e) => e.gates);
  if (withGates.length === 0) return "";
  const gates = withGates[0].gates!;
  const rows = gates.map((gate, g) => [
    escapeHtml(gate.smell),
    escapeHtml(gate.rule),
    String(gate.gatedTests),
    ...evaluations.map((e) => {
      const result = e.gates?.[g];
      return result ? `${result.modelViolations} (${pct(result.gatedTests ? result.modelViolations / result.gatedTests : 0)})` : "–";
    }),
  ]);
  return section(
    "AST Hard-Rule Violations",
    table(
      [
        { label: "Smell", align: "left" },
        { label: "Rule", align: "left" },
        { label: "Gated tests" },
        ...labels.map((label) => ({ label })),
      ],
      rows,
      "How often each model predicted a smell that the AST metrics in its prompt rule out.",
    ),
  );
}

/**
 * Compares several evaluated runs: writes cross_model_summary.json
 * (smell → model → F1), cross_model_report.json and an HTML report with a
 * leaderboard, per-smell matrices, a majority-vote ensemble, AST-rule
 * compliance and inter-model agreement.
 */
export function writeCrossModelReport(analyzer: AnalyzerConfig, versions: string[]): void {
  const outputDir = path.resolve(analyzer.outputDir);
  const evaluations = versions.flatMap((version) => {
    try {
      return [evaluateRun({ ...analyzer, version })];
    } catch (error) {
      console.warn(`  Skipping ${version}: ${(error as Error).message}`);
      return [];
    }
  });
  if (evaluations.length < 2) {
    console.warn("  Cross-model report needs at least two evaluated runs.");
    return;
  }

  const labels = runLabels(evaluations);
  const summary: Record<string, Record<string, number>> = {};
  evaluations.forEach((e, i) => {
    for (const { smell, f1 } of e.metrics) summary[smell] = { ...summary[smell], [labels[i]]: f1 };
  });
  const summaryPath = path.join(outputDir, "cross_model_summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n📊 Cross-model summary saved to ${summaryPath}`);

  const models = evaluations.map((e, i) => contenderFromRun(e, labels[i]));
  // Voting only makes sense between different models given the same prompt.
  const sameSetup = new Set(evaluations.map((e) => e.version.split("__")[1])).size === 1;
  const ensemble = sameSetup && evaluations.length >= 3 ? ensembleContender(evaluations) : null;
  const ablation = ablationRows(evaluations);
  const contenders = ensemble ? [...models, ensemble] : models;

  fs.writeFileSync(path.join(outputDir, "cross_model_report.json"), JSON.stringify(contenders, null, 2));

  const body = [
    section(
      "Key Findings",
      `<ul class="list-disc pl-6 space-y-2 text-gray-200">${[...crossInsights(models, ensemble), ...ablationInsights(ablation)].map((i) => `<li>${i}</li>`).join("")}</ul>`,
    ),
    section("Leaderboard", leaderboard(contenders)),
    ablationSection(ablation),
    section("F1 by Smell", perSmellMatrix(contenders, (m) => pct(m?.f1 ?? 0), (m) => m?.f1 ?? 0)),
    section(
      "Precision / Recall by Smell",
      perSmellMatrix(
        contenders,
        (m) => `${pct(m?.precision ?? 0)} / ${pct(m?.recall ?? 0)}`,
        (m) => m?.f1 ?? 0,
      ),
    ),
    gateMatrix(evaluations, labels),
    section("Inter-Model Agreement", agreementMatrix(evaluations, labels)),
    section(
      "How to Read This Report",
      `<ul class="list-disc pl-6 space-y-1 text-sm text-gray-400">
        <li>Rows are ordered by goldset support; smells under ${LOW_SUPPORT} cases are flagged as low support.</li>
        <li>The best score in each row is outlined.</li>
        <li>The majority vote labels a smell when most models predict it, scored only on tests every model answered.</li>
        <li>Each model is scored on its own parseable replies; see the leaderboard for how many were invalid.</li>
      </ul>`,
    ),
  ].join("\n");

  const reportPath = path.join(outputDir, "cross_model_report.html");
  fs.writeFileSync(
    reportPath,
    page(
      "Cross-Model Comparison",
      `${evaluations.length} runs · ${sameSetup ? escapeHtml(setupLabel(parseSetup(evaluations[0].version))) : "mixed prompt setups"}`,
      body,
    ),
  );
  console.log(`📊 Cross-model report saved to ${reportPath}`);
}
