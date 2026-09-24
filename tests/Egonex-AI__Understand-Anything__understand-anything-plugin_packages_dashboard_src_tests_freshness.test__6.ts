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
  it("replaces stale and fresh states after successive focus events", async () => {
      const target = new EventTarget();
      const load = vi
        .fn<(signal: AbortSignal) => Promise<DashboardFreshnessReport>>()
        .mockResolvedValueOnce(staleReport)
        .mockResolvedValueOnce(freshReport)
        .mockResolvedValueOnce(staleReport);
      const onResult = vi.fn();

      const stop = startFreshnessRefresh({ target, load, onResult });
      await flushPromises();
      expect(onResult).toHaveBeenLastCalledWith(staleReport);

      target.dispatchEvent(new Event("focus"));
      await flushPromises();
      expect(onResult).toHaveBeenLastCalledWith(freshReport);

      target.dispatchEvent(new Event("focus"));
      await flushPromises();
      expect(onResult).toHaveBeenLastCalledWith(staleReport);
      expect(onResult).toHaveBeenCalledTimes(3);

      stop();
    })
  // ── END TARGET TEST ─────────────────────────────
});