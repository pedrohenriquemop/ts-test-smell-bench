import type { CallExpression, SourceFile } from "ts-morph";
import { DEFAULT_FILE_METRICS, DEFAULT_METRICS } from "./metric.registry.ts";

export function metricsRecord(testCall: CallExpression): Record<string, unknown> {
  return Object.fromEntries(DEFAULT_METRICS.map((m) => [m.name, m.extract(testCall)]));
}

/** Metrics computed once per file and shared by all of its tests. */
export function fileMetricsRecord(sourceFile: SourceFile): Record<string, unknown> {
  return Object.fromEntries(DEFAULT_FILE_METRICS.map((m) => [m.name, m.extract(sourceFile)]));
}
