import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isDashboardFreshnessReport,
  requestFreshnessReport,
  shouldRequestFreshness,
  startFreshnessRefresh,
  type DashboardFreshnessReport,
} from "../freshness";

const freshReport: DashboardFreshnessReport = {
  graphs: {
    knowledge: {
      status: "fresh",
      graphCommitHash: "a".repeat(40),
      headCommitHash: "a".repeat(40),
      changedFileCount: 0,
      changedFiles: [],
      commitsBehind: 0,
      commitsAhead: 0,
    },
  },
};
const staleReport: DashboardFreshnessReport = {
  graphs: {
    knowledge: {
      status: "stale",
      relation: "behind",
      graphCommitHash: "a".repeat(40),
      headCommitHash: "b".repeat(40),
      changedFileCount: 1,
      changedFiles: ["src/index.ts"],
      commitsBehind: 1,
      commitsAhead: 0,
    },
  },
};
async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}
afterEach(() => {
  vi.useRealTimers();
});

describe("shouldRequestFreshness", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("skips static demos that cannot verify a live Git checkout", () => {
      expect(shouldRequestFreshness(true, undefined)).toBe(false);
      expect(shouldRequestFreshness(true, "")).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});