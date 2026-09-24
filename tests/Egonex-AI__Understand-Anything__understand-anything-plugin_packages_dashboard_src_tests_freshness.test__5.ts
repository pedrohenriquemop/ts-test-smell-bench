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
  it("aborts an in-flight request before replacing it on focus", async () => {
      const target = new EventTarget();
      const pending: Array<{
        signal: AbortSignal;
        resolve: (report: DashboardFreshnessReport) => void;
      }> = [];
      const load = vi.fn(
        (signal: AbortSignal) =>
          new Promise<DashboardFreshnessReport>((resolve) => {
            pending.push({ signal, resolve });
          }),
      );
      const onResult = vi.fn();

      const stop = startFreshnessRefresh({ target, load, onResult });
      expect(pending).toHaveLength(1);
      target.dispatchEvent(new Event("focus"));
      expect(pending).toHaveLength(2);
      expect(pending[0].signal.aborted).toBe(true);

      pending[0].resolve(staleReport);
      pending[1].resolve(freshReport);
      await flushPromises();
      expect(onResult).toHaveBeenCalledTimes(1);
      expect(onResult).toHaveBeenCalledWith(freshReport);

      stop();
    })
  // ── END TARGET TEST ─────────────────────────────
});