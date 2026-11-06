import * as fs from "fs";
import type { RunEvaluation } from "./index.ts";
import type { Metric } from "./metrics.ts";
import {
  badge,
  ci,
  escapeHtml,
  LOW_SUPPORT,
  page,
  pct,
  scoreColor,
  section,
  statCards,
  table,
} from "./html.ts";

const support = (m: Metric) => m.tp + m.fn;
const predicted = (m: Metric) => m.tp + m.fp;

/** Plain-language findings derived from the numbers, for a quick read. */
export function runInsights(evaluation: RunEvaluation): string[] {
  const { metrics, aggregates, gates, invalidFiles, totalRecords } = evaluation;
  const insights: string[] = [];
  const reliable = metrics.filter((m) => support(m) >= LOW_SUPPORT);

  if (reliable.length > 0) {
    const byF1 = [...reliable].sort((a, b) => b.f1 - a.f1);
    const best = byF1[0];
    const worst = byF1[byF1.length - 1];
    insights.push(
      `Among smells with at least ${LOW_SUPPORT} goldset cases, the model is strongest on <b>${escapeHtml(best.smell)}</b> (F1 ${pct(best.f1)}) and weakest on <b>${escapeHtml(worst.smell)}</b> (F1 ${pct(worst.f1)}).`,
    );

    const bias = reliable
      .map((m) => ({ smell: m.smell, ratio: predicted(m) / support(m) }))
      .sort((a, b) => b.ratio - a.ratio);
    const over = bias[0];
    const under = bias[bias.length - 1];
    if (over.ratio >= 1.5) {
      insights.push(
        `It over-predicts <b>${escapeHtml(over.smell)}</b>: ${over.ratio.toFixed(1)}× as many predictions as goldset cases, which lowers precision.`,
      );
    }
    if (under.ratio <= 0.5) {
      insights.push(
        `It under-predicts <b>${escapeHtml(under.smell)}</b>: only ${under.ratio.toFixed(2)}× as many predictions as goldset cases, which lowers recall.`,
      );
    }
  }

  const lowSupport = metrics.filter((m) => support(m) > 0 && support(m) < LOW_SUPPORT);
  if (lowSupport.length > 0) {
    insights.push(
      `${lowSupport.length} smell(s) have fewer than ${LOW_SUPPORT} goldset cases (${lowSupport.map((m) => `${escapeHtml(m.smell)}: ${support(m)}`).join(", ")}); their F1 can swing widely with a single test, as the wide confidence intervals show.`,
    );
  }

  insights.push(
    `On average the model assigns ${aggregates.meanPredictedLabels.toFixed(2)} smells per test against ${aggregates.meanReferenceLabels.toFixed(2)} in the goldset, and gets the complete set right on ${pct(aggregates.exactMatch)} of tests.`,
  );

  if (gates) {
    const gated = gates.reduce((s, g) => s + g.gatedTests, 0);
    const violations = gates.reduce((s, g) => s + g.modelViolations, 0);
    if (gated > 0) {
      insights.push(
        `It ignored an AST hard rule ${violations} time(s) across ${gated} gated decisions (${pct(violations / gated)}), predicting a smell the metrics rule out.`,
      );
    }
  }

  if (invalidFiles.length > 0) {
    insights.push(
      `${invalidFiles.length} of ${totalRecords} replies could not be parsed and are excluded from every score above.`,
    );
  }
  return insights;
}

export function smellTable(metrics: Metric[], confidence?: Record<string, [number, number]>): string {
  const rows = [...metrics]
    .sort((a, b) => support(b) - support(a) || a.smell.localeCompare(b.smell))
    .map((m) => {
      const s = support(m);
      const bias = s > 0 ? `${(predicted(m) / s).toFixed(2)}×` : predicted(m) > 0 ? "∞" : "–";
      const lowBadge = s > 0 && s < LOW_SUPPORT ? badge("low support") : "";
      return [
        `${escapeHtml(m.smell)}${lowBadge}`,
        String(s),
        String(predicted(m)),
        String(m.tp),
        String(m.fp),
        String(m.fn),
        pct(m.precision),
        pct(m.recall),
        `<span class="px-2 py-0.5 rounded" style="background:${scoreColor(m.f1)}">${pct(m.f1)}</span>`,
        ...(confidence ? [confidence[m.smell] ? ci(confidence[m.smell]) : "–"] : []),
        bias,
      ];
    });
  return table(
    [
      { label: "Smell", align: "left" },
      { label: "Support", title: "Goldset tests with the smell" },
      { label: "Predicted", title: "Tests the model labelled with the smell" },
      { label: "TP" },
      { label: "FP" },
      { label: "FN" },
      { label: "Precision" },
      { label: "Recall" },
      { label: "F1" },
      ...(confidence ? [{ label: "F1 95% CI", title: "Bootstrap interval, 1000 resamples of the tests" }] : []),
      { label: "Pred / Gold", title: "Above 1: over-predicts. Below 1: under-predicts." },
    ],
    rows,
  );
}

function chartScripts(metrics: Metric[]): string {
  return `<script>
    const labels = ${JSON.stringify(metrics.map((m) => m.smell))};
    Chart.defaults.color = '#94a3b8';
    new Chart(document.getElementById('barChart'), {
      type: 'bar',
      data: { labels, datasets: [
        { label: 'Precision', data: ${JSON.stringify(metrics.map((m) => m.precision))}, backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 },
        { label: 'Recall', data: ${JSON.stringify(metrics.map((m) => m.recall))}, backgroundColor: 'rgba(139, 92, 246, 0.8)', borderRadius: 4 },
        { label: 'F1-Score', data: ${JSON.stringify(metrics.map((m) => m.f1))}, backgroundColor: 'rgba(16, 185, 129, 0.8)', borderRadius: 4 },
      ] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true, max: 1, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { display: false } } } },
    });
    new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: { labels, datasets: [{ label: 'F1-Score', data: ${JSON.stringify(metrics.map((m) => m.f1))},
        backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 1)', pointBackgroundColor: 'rgba(16, 185, 129, 1)', borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { r: { min: 0, max: 1, angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' },
          pointLabels: { color: '#94a3b8', font: { size: 12 } }, ticks: { display: false } } } },
    });
  </script>`;
}

function gatesSection(evaluation: RunEvaluation): string {
  if (!evaluation.gates) {
    return section("AST Hard-Rule Compliance", `<p class="text-gray-400">Manifest not found, so the AST metrics needed for this check are unavailable.</p>`);
  }
  const rows = evaluation.gates.map((g) => [
    escapeHtml(g.smell),
    escapeHtml(g.rule),
    String(g.gatedTests),
    `${g.modelViolations} (${pct(g.gatedTests ? g.modelViolations / g.gatedTests : 0)})`,
    String(g.referenceViolations),
  ]);
  return section(
    "AST Hard-Rule Compliance",
    table(
      [
        { label: "Smell", align: "left" },
        { label: "Rule that rules it out", align: "left" },
        { label: "Gated tests" },
        { label: "Model predicted anyway" },
        { label: "Goldset labelled anyway", title: "Disagreement between the goldset and the AST metrics" },
      ],
      rows,
      "The prompt states these as absolute rules. Violations show how often the model ignores the AST metrics it was given.",
    ),
  );
}

function hotspotsSection(evaluation: RunEvaluation): string {
  if (evaluation.hotspots.length === 0) return "";
  const list = (smells: string[]) => (smells.length ? smells.map(escapeHtml).join(", ") : "–");
  const rows = evaluation.hotspots.map((h) => [
    `<code class="text-xs">${escapeHtml(h.file)}</code>`,
    list(h.falseNegatives),
    list(h.falsePositives),
  ]);
  return section(
    "Error Hotspots",
    table(
      [
        { label: "Test", align: "left" },
        { label: "Missed (FN)", align: "left" },
        { label: "Wrongly predicted (FP)", align: "left" },
      ],
      rows,
      "Tests with the most wrong decisions; good candidates for qualitative analysis.",
    ),
  );
}

function reliabilitySection(evaluation: RunEvaluation): string {
  const { latency, invalidFiles, totalRecords } = evaluation;
  const latencyRows = latency
    ? [
        ["Mean", `${latency.meanSeconds.toFixed(1)} s`],
        ["Median", `${latency.medianSeconds.toFixed(1)} s`],
        ["90th percentile", `${latency.p90Seconds.toFixed(1)} s`],
        ["Slowest test", `${latency.maxSeconds.toFixed(1)} s`],
        ["Total inference time", `${latency.totalHours.toFixed(2)} h`],
      ]
    : [];
  const invalid = invalidFiles.length
    ? `<p class="text-sm text-gray-400 mt-4">Unparseable replies (excluded from scores): ${invalidFiles
        .map((f) => `<code class="text-xs">${escapeHtml(f)}</code>`)
        .join(", ")}</p>`
    : "";
  return section(
    "Reliability & Latency",
    `<p class="text-sm text-gray-400 mb-3">Parseable replies: ${totalRecords - invalidFiles.length} of ${totalRecords}.</p>
    ${latencyRows.length ? table([{ label: "Latency per test", align: "left" }, { label: "Value" }], latencyRows) : ""}
    ${invalid}`,
  );
}

export function writeModelReport(evaluation: RunEvaluation, outputPath: string): void {
  const { aggregates: a, confidence, metrics, results, invalidFiles, totalRecords } = evaluation;
  const cards = statCards([
    { label: "Macro F1", value: pct(a.macro.f1), hint: `95% CI ${ci(confidence.macroF1)}` },
    { label: "Micro F1", value: pct(a.micro.f1), hint: `P ${pct(a.micro.precision)} · R ${pct(a.micro.recall)}` },
    { label: "Weighted F1", value: pct(a.weightedF1), hint: "by goldset support" },
    { label: "Exact match", value: pct(a.exactMatch), hint: "whole smell set correct" },
    { label: "Mean Jaccard", value: pct(a.meanJaccard), hint: "per-test set overlap" },
    { label: "Scored tests", value: `${results.length}/${totalRecords}`, hint: `${invalidFiles.length} unparseable` },
  ]);

  const insights = section(
    "Key Findings",
    `<ul class="list-disc pl-6 space-y-2 text-gray-200">${runInsights(evaluation).map((i) => `<li>${i}</li>`).join("")}</ul>`,
  );

  const charts = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    ${section("Precision / Recall / F1", `<div class="relative h-[400px]"><canvas id="barChart"></canvas></div>`)}
    ${section("F1 by Smell", `<div class="relative h-[400px]"><canvas id="radarChart"></canvas></div>`)}
  </div>`;

  const literal = evaluation.literalBreakdown.length
    ? section(
        "Magic Number vs Hardcoded Literal",
        smellTable(evaluation.literalBreakdown) +
          `<p class="text-sm text-gray-400 mt-3">The main tables score them as one category; here each is scored on its own label.</p>`,
      )
    : "";

  const notes = section(
    "How to Read This Report",
    `<ul class="list-disc pl-6 space-y-1 text-sm text-gray-400">
      <li><b>Macro F1</b> averages the per-smell F1 over smells present in the goldset; <b>micro F1</b> pools TP/FP/FN over all smells, so frequent smells dominate it.</li>
      <li>Confidence intervals come from 1000 bootstrap resamples of the scored tests (fixed seed, reproducible).</li>
      <li>Smells with fewer than ${LOW_SUPPORT} goldset cases are flagged as low support.</li>
      <li>Magic Number and Hardcoded Literal are merged into one category except in their dedicated table.</li>
      <li>Unparseable replies are excluded from every score.</li>
    </ul>`,
  );

  const body = [
    cards,
    insights,
    charts,
    section("Per-Smell Scores", smellTable(metrics, confidence.perSmell)),
    literal,
    gatesSection(evaluation),
    hotspotsSection(evaluation),
    reliabilitySection(evaluation),
    notes,
  ].join("\n");

  const subtitle = `${escapeHtml(evaluation.version || "model")} vs goldset · ${results.length} tests scored`;
  fs.writeFileSync(outputPath, page("Test Smell Evaluation Report", subtitle, body, chartScripts(metrics)));
  console.log(`Interactive HTML Report saved to ${outputPath}`);
}
