/**
 * Cross-Setup Comparative Analysis — scans evaluation metrics files
 * and produces a matrix comparing F1 scores across different
 * model × prompt-strategy × ablation-toggle combinations.
 *
 * This supports Fase 4 ("Ablação e Diversificação"): answering
 * "does CoT improve detection?", "do AST metrics matter?", etc.
 */

import * as fs from 'fs';
import * as path from 'path';

// ── Types ────────────────────────────────────────────────────────────

export interface RunTag {
  /** The full version tag (e.g. "llama3-local__cot-ast-ctx"). */
  tag: string;
  /** Parsed model ID. */
  modelId: string;
  /** Parsed strategy. */
  strategy: string;
  /** Whether AST metrics were included. */
  hasAst: boolean;
  /** Whether context was included. */
  hasContext: boolean;
}

export interface ComparisonMatrix {
  /** All smell types found across runs. */
  smells: string[];
  /** All run tags found. */
  runs: RunTag[];
  /** Matrix: matrix[smell][tag] = f1 score */
  data: Record<string, Record<string, number>>;
  /** Per-run averages. */
  averages: Record<string, number>;
}

// ── Tag parser ───────────────────────────────────────────────────────

/**
 * Parse a version tag like "llama3-local__cot-ast-ctx" into its
 * components.  Falls back gracefully if the tag doesn't follow
 * the convention.
 */
export function parseRunTag(tag: string): RunTag {
  const parts = tag.split('__');
  const modelId = parts[0] ?? tag;

  if (parts.length < 2) {
    return { tag, modelId, strategy: 'unknown', hasAst: true, hasContext: true };
  }

  const setupParts = parts[1].split('-');
  const strategy = setupParts[0] ?? 'standard';
  const hasAst = !setupParts.includes('noast');
  const hasContext = !setupParts.includes('noctx');

  return { tag, modelId, strategy, hasAst, hasContext };
}

// ── Core comparison ──────────────────────────────────────────────────

export function buildComparisonMatrix(outputDir: string, filterModel?: string): ComparisonMatrix {
  const files = fs.readdirSync(outputDir)
    .filter((f) => f.startsWith('evaluation_metrics_v') && f.endsWith('.json'));

  if (files.length === 0) {
    throw new Error(`No evaluation_metrics files found in ${outputDir}`);
  }

  const runs: RunTag[] = [];
  const data: Record<string, Record<string, number>> = {};
  const smellSet = new Set<string>();

  for (const file of files) {
    const tag = file.replace('evaluation_metrics_v', '').replace('.json', '');
    const runTag = parseRunTag(tag);

    // Filter by model if requested
    if (filterModel && runTag.modelId !== filterModel) continue;

    runs.push(runTag);

    const metrics: Array<{ smell: string; f1: number }> = JSON.parse(
      fs.readFileSync(path.join(outputDir, file), 'utf-8'),
    );

    for (const m of metrics) {
      smellSet.add(m.smell);
      if (!data[m.smell]) data[m.smell] = {};
      data[m.smell][tag] = m.f1;
    }
  }

  // Compute per-run averages
  const averages: Record<string, number> = {};
  for (const run of runs) {
    const f1Values = Object.values(data)
      .map((smellData) => smellData[run.tag] ?? 0);
    averages[run.tag] = f1Values.length > 0
      ? f1Values.reduce((a, b) => a + b, 0) / f1Values.length
      : 0;
  }

  return {
    smells: Array.from(smellSet).sort(),
    runs,
    data,
    averages,
  };
}

// ── HTML heatmap report ──────────────────────────────────────────────

export function generateComparisonHtml(matrix: ComparisonMatrix, outputPath: string): void {
  const { smells, runs, data, averages } = matrix;

  const headerCells = runs
    .map((r) => {
      const label = `${r.modelId}<br/><small>${r.strategy} | AST:${r.hasAst ? '✓' : '✗'} CTX:${r.hasContext ? '✓' : '✗'}</small>`;
      return `<th class="run-header">${label}</th>`;
    })
    .join('');

  const bodyRows = smells
    .map((smell) => {
      const cells = runs
        .map((r) => {
          const f1 = data[smell]?.[r.tag] ?? 0;
          const pct = (f1 * 100).toFixed(1);
          const hue = Math.round(f1 * 120); // 0=red, 120=green
          const bg = `hsl(${hue}, 70%, 35%)`;
          return `<td style="background:${bg}; color: white; text-align: center;">${pct}%</td>`;
        })
        .join('');
      return `<tr><td class="smell-name">${smell}</td>${cells}</tr>`;
    })
    .join('');

  const avgCells = runs
    .map((r) => {
      const avg = (averages[r.tag] * 100).toFixed(1);
      return `<td style="text-align: center; font-weight: bold;">${avg}%</td>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cross-Setup Comparison</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { text-align: center; color: #38bdf8; }
    table { border-collapse: collapse; width: 100%; margin-top: 2rem; }
    th, td { padding: 0.75rem 1rem; border: 1px solid #334155; }
    th { background: #1e293b; }
    .run-header { font-size: 0.8rem; min-width: 140px; }
    .smell-name { font-weight: 600; white-space: nowrap; }
    tr:hover { outline: 2px solid #38bdf8; }
    .avg-row td { background: #1e293b !important; color: #38bdf8 !important; }
  </style>
</head>
<body>
  <h1>Cross-Setup F1 Score Comparison</h1>
  <p style="text-align:center; color:#94a3b8;">${runs.length} runs × ${smells.length} smells</p>
  <table>
    <thead>
      <tr><th>Smell</th>${headerCells}</tr>
    </thead>
    <tbody>
      ${bodyRows}
      <tr class="avg-row"><td><strong>Average</strong></td>${avgCells}</tr>
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(`📊 Comparison heatmap saved to ${outputPath}`);
}
