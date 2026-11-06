import * as fs from "fs";
import * as path from "path";
import type { AnalyzerConfig } from "../config/index.ts";
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

/** Short display label: the model ID, or the full run tag when IDs repeat. */
function runLabels(evaluations: RunEvaluation[]): string[] {
  const ids = evaluations.map((e) => e.modelId);
  return evaluations.map((e) => (ids.filter((id) => id === e.modelId).length > 1 ? e.version : e.modelId));
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
  const ensemble = evaluations.length >= 3 ? ensembleContender(evaluations) : null;
  const contenders = ensemble ? [...models, ensemble] : models;

  fs.writeFileSync(path.join(outputDir, "cross_model_report.json"), JSON.stringify(contenders, null, 2));

  const body = [
    section(
      "Key Findings",
      `<ul class="list-disc pl-6 space-y-2 text-gray-200">${crossInsights(models, ensemble).map((i) => `<li>${i}</li>`).join("")}</ul>`,
    ),
    section("Leaderboard", leaderboard(contenders)),
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
    page("Cross-Model Comparison", `${evaluations.length} models · ${escapeHtml(versions[0].split("__")[1] ?? "")}`, body),
  );
  console.log(`📊 Cross-model report saved to ${reportPath}`);
}
