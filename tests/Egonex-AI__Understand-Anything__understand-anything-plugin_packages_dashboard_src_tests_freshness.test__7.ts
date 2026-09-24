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

describe("startFreshnessRefresh", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("publishes an explicit unknown result when loading fails", async () => {
      const onResult = vi.fn();

      const stop = startFreshnessRefresh({
        target: new EventTarget(),
        load: vi.fn(async () => {
          throw new Error("network unavailable");
        }),
        onResult,
      });
      await flushPromises();

      expect(onResult).toHaveBeenCalledWith({
        graphs: {
          knowledge: {
            status: "unknown",
            reason: "freshness-request-failed",
          },
        },
      });
      stop();
    })
  // ── END TARGET TEST ─────────────────────────────
});