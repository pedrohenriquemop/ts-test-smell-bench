import { type CallExpression, type SourceFile } from "ts-morph";
import { DEFAULT_METRICS, DEFAULT_FILE_METRICS } from "./metric.registry.ts";
import type { MetricDescriptor, MetricReading, FileMetricDescriptor } from "./metric.ts";

export { DEFAULT_METRICS, DEFAULT_FILE_METRICS };

export function metricReadings(
  testCall: CallExpression,
  metrics: readonly MetricDescriptor<unknown>[],
): MetricReading<unknown>[] {
  return metrics.map((m) => ({
    name: m.name,
    value: m.extract(testCall),
  }));
}

export function metricsRecord(
  testCall: CallExpression,
  metrics: readonly MetricDescriptor<unknown>[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const m of metrics) {
    out[m.name] = m.extract(testCall);
  }
  return out;
}

/**
 * Extract file-level metrics from a SourceFile.
 * These are computed once per file and shared across all test cases in it.
 */
export function fileMetricsRecord(
  sourceFile: SourceFile,
  metrics: readonly FileMetricDescriptor<unknown>[] = DEFAULT_FILE_METRICS,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const m of metrics) {
    out[m.name] = m.extract(sourceFile);
  }
  return out;
}
