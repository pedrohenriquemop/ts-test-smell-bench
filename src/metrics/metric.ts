import type { CallExpression, SourceFile } from "ts-morph";

export type MetricDescriptor<T> = {
  readonly name: string;
  readonly description: string;
  readonly extract: (testCall: CallExpression) => T;
};

/** A metric over the whole source file (imports, setup hooks, …). */
export type FileMetricDescriptor<T> = {
  readonly name: string;
  readonly description: string;
  readonly extract: (sourceFile: SourceFile) => T;
};
