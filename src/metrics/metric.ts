import { type CallExpression } from "ts-morph";

export type MetricReading<T> = {
  readonly name: string;
  readonly value: T;
};

export type MetricDescriptor<T> = {
  readonly name: string;
  readonly description: string;
  readonly extract: (testCall: CallExpression) => T;
};
