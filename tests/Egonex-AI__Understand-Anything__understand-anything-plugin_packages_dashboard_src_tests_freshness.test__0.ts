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

describe("isDashboardFreshnessReport", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("accepts complete fresh, dirty, stale, and unknown graph results", () => {
      expect(isDashboardFreshnessReport(freshReport)).toBe(true);
      expect(
        isDashboardFreshnessReport({
          graphs: {
            knowledge: {
              status: "dirty",
              graphCommitHash: "a".repeat(40),
              headCommitHash: "a".repeat(40),
              changedFileCount: 1,
              changedFiles: ["src/dirty.ts"],
              commitsBehind: 0,
              commitsAhead: 0,
            },
            domain: staleReport.graphs.knowledge,
          },
        }),
      ).toBe(true);
      expect(
        isDashboardFreshnessReport({
          graphs: {
            knowledge: {
              status: "unknown",
              reason: "git-command-timeout",
              graphCommitHash: "a".repeat(40),
            },
          },
        }),
      ).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
  it.each([
      { graphs: { knowledge: { status: "fresh" } } },
      { graphs: { knowledge: { status: "stale" } } },
      { graphs: { knowledge: { status: "dirty" } } },
      { graphs: { knowledge: { status: "unknown" } } },
      { graphs: {} },
      { graphs: { knowledge: freshReport.graphs.knowledge, domain: null } },
      {
        graphs: {
          knowledge: {
            ...freshReport.graphs.knowledge,
            changedFileCount: 1,
          },
        },
      },
      {
        graphs: {
          knowledge: {
            ...staleReport.graphs.knowledge,
            relation: "sideways",
          },
        },
      },
      {
        graphs: {
          knowledge: {
            ...staleReport.graphs.knowledge,
            changedFiles: [42],
          },
        },
      },
      {
        graphs: {
          knowledge: {
            status: "unknown",
            reason: "unexpected-reason",
          },
        },
      },
    ])("rejects malformed payload %#", (payload) => {
      expect(isDashboardFreshnessReport(payload)).toBe(false);
    });
});