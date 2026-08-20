import { type CallExpression, type SourceFile } from "ts-morph";

export type MetricReading<T> = {
  readonly name: string;
  readonly value: T;
};

export type MetricDescriptor<T> = {
  readonly name: string;
  readonly description: string;
  readonly extract: (testCall: CallExpression) => T;
};

/**
 * A metric that operates on the whole source file rather than a single
 * test call.  Used for imports, setup hooks, and other file-level data.
 */
export type FileMetricDescriptor<T> = {
  readonly name: string;
  readonly description: string;
  readonly extract: (sourceFile: SourceFile) => T;
};
