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
  it("loads initially and only reloads when the target receives focus", async () => {
      vi.useFakeTimers();
      const target = new EventTarget();
      const load = vi.fn(async () => freshReport);
      const onResult = vi.fn();

      const stop = startFreshnessRefresh({ target, load, onResult });
      await flushPromises();
      expect(load).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(60_000);
      expect(load).toHaveBeenCalledTimes(1);

      target.dispatchEvent(new Event("focus"));
      await flushPromises();
      expect(load).toHaveBeenCalledTimes(2);
      expect(onResult).toHaveBeenLastCalledWith(freshReport);

      stop();
      vi.useRealTimers();
    })
  // ── END TARGET TEST ─────────────────────────────
});