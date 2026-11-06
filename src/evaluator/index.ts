import * as fs from "fs";
import * as path from "path";
import { resultsSuffix, type AnalyzerConfig } from "../config/index.ts";
import { standardizeSmellList } from "../smells/catalog.ts";
import { generatePngCharts } from "./charts.ts";
import { writeModelReport } from "./report.ts";
import {
  aggregate,
  bootstrapF1,
  errorHotspots,
  gateCompliance,
  latencyStats,
  LITERAL_CATEGORY,
  scoreSmell,
  smellCategories,
  type Aggregates,
  type ErrorHotspot,
  type GateCompliance,
  type Interval,
  type LatencyStats,
  type Metric,
  type ScoredResult,
} from "./metrics.ts";

export type { Metric } from "./metrics.ts";

export interface RunEvaluation {
  version: string;
  modelId: string;
  totalRecords: number;
  /** Only tests the model answered in a parseable format are scored. */
  results: ScoredResult[];
  invalidFiles: string[];
  /** Per category, with Magic Number and Hardcoded Literal merged. */
  metrics: Metric[];
  /** Magic Number and Hardcoded Literal scored on their own. */
  literalBreakdown: Metric[];
  aggregates: Aggregates;
  confidence: { perSmell: Record<string, Interval>; macroF1: Interval };
  /** Null when the manifest with the AST metrics is not available. */
  gates: GateCompliance[] | null;
  hotspots: ErrorHotspot[];
  latency: LatencyStats | null;
}

interface RawRecord {
  file: string;
  referenceSmells?: unknown;
  modelSmells?: unknown;
  modelStatus?: string;
  latencyMs?: number;
}

function readAstMetrics(manifestPath: string): Map<string, Record<string, unknown>> | null {
  const fullPath = path.resolve(manifestPath);
  if (!fs.existsSync(fullPath)) return null;
  const manifest: Array<{ file: string; metrics?: Record<string, unknown> }> =
    JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  return new Map(manifest.map((entry) => [entry.file, entry.metrics ?? {}]));
}

/** Scores one run's comparison results against the goldset labels stored with them. */
export function evaluateRun(analyzer: AnalyzerConfig): RunEvaluation {
  const inputPath = path.resolve(analyzer.outputDir, `comparison_results${resultsSuffix(analyzer)}.json`);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Comparison results not found at ${inputPath}`);
  }

  const records: RawRecord[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const results: ScoredResult[] = records
    .filter((r) => r.modelStatus === "success")
    .map((r) => ({
      file: r.file,
      referenceSmells: standardizeSmellList(r.referenceSmells ?? []),
      modelSmells: standardizeSmellList(r.modelSmells ?? []),
    }));

  const categories = smellCategories(results);
  const metrics = categories.map((smell) => scoreSmell(smell, results));
  const supported = metrics.filter((m) => m.tp + m.fn > 0).map((m) => m.smell);
  const astMetrics = readAstMetrics(analyzer.manifestPath);
  const version = analyzer.version ?? "";

  return {
    version,
    modelId: version.split("__")[0],
    totalRecords: records.length,
    results,
    invalidFiles: records.filter((r) => r.modelStatus !== "success").map((r) => r.file),
    metrics,
    literalBreakdown: categories.includes(LITERAL_CATEGORY)
      ? ["Magic Number", "Hardcoded Literal"].map((smell) => scoreSmell(smell, results, (s) => s))
      : [],
    aggregates: aggregate(metrics, results),
    confidence: bootstrapF1(results, categories, supported),
    gates: astMetrics ? gateCompliance(results, astMetrics) : null,
    hotspots: errorHotspots(results),
    latency: latencyStats(records.flatMap((r) => (typeof r.latencyMs === "number" ? [r.latencyMs] : []))),
  };
}

/**
 * Writes, per run: evaluation_metrics (per-smell scores), evaluation_summary
 * (aggregates, confidence intervals, gate compliance, error hotspots,
 * latency), an HTML report and PNG charts.
 */
export async function evaluateResults(analyzer: AnalyzerConfig): Promise<RunEvaluation> {
  const evaluation = evaluateRun(analyzer);
  const versionSuffix = resultsSuffix(analyzer);
  const outputDir = path.resolve(analyzer.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const metricsPath = path.join(outputDir, `evaluation_metrics${versionSuffix}.json`);
  fs.writeFileSync(metricsPath, JSON.stringify(evaluation.metrics, null, 2));
  console.log(`JSON metrics saved to ${metricsPath}`);

  const summaryPath = path.join(outputDir, `evaluation_summary${versionSuffix}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify({ ...evaluation, results: undefined }, null, 2));
  console.log(`Evaluation summary saved to ${summaryPath}`);

  writeModelReport(evaluation, path.join(outputDir, `report${versionSuffix}.html`));
  await generatePngCharts(evaluation.metrics, outputDir, versionSuffix);
  return evaluation;
}
