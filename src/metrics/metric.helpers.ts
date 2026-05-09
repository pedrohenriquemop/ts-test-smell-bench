import { type CallExpression } from "ts-morph";
import { DEFAULT_METRICS } from "./metric.registry.ts";
import type { MetricDescriptor, MetricReading } from "./metric.ts";

export { DEFAULT_METRICS };

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
