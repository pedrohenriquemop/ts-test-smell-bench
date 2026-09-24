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

describe("requestFreshnessReport", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns only a fully validated response", async () => {
      const signal = new AbortController().signal;
      const fetcher = vi.fn(async () => ({
        ok: true,
        json: async () => freshReport,
      })) as unknown as typeof fetch;

      await expect(
        requestFreshnessReport("/staleness.json", signal, fetcher),
      ).resolves.toEqual(freshReport);
      expect(fetcher).toHaveBeenCalledWith("/staleness.json", {
        signal,
        cache: "no-store",
      });
    })
  // ── END TARGET TEST ─────────────────────────────
  it.each([
      { ok: false, json: async () => freshReport },
      { ok: true, json: async () => ({ graphs: { knowledge: { status: "fresh" } } }) },
    ])("rejects an unusable endpoint response %#", async (response) => {
      const fetcher = vi.fn(async () => response) as unknown as typeof fetch;

      await expect(
        requestFreshnessReport("/staleness.json", new AbortController().signal, fetcher),
      ).rejects.toThrow();
    });
});