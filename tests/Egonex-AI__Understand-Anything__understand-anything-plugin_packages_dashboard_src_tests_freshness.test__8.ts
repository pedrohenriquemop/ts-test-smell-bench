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
  it("removes the focus listener and aborts on cleanup", async () => {
      const target = new EventTarget();
      let initialSignal: AbortSignal | undefined;
      const load = vi.fn(
        (signal: AbortSignal) =>
          new Promise<DashboardFreshnessReport>(() => {
            initialSignal = signal;
          }),
      );

      const stop = startFreshnessRefresh({
        target,
        load,
        onResult: vi.fn(),
      });
      stop();

      expect(initialSignal?.aborted).toBe(true);
      target.dispatchEvent(new Event("focus"));
      expect(load).toHaveBeenCalledTimes(1);
    })
  // ── END TARGET TEST ─────────────────────────────
});