import { describe, it, expect } from "vitest";
import { normalizeNodeId } from "../analyzer/normalize-graph.js";


describe("normalizeNodeId — domain types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes flow node IDs", () => {
      const result = normalizeNodeId("flow:create-order", {
        type: "flow",
        name: "Create Order",
      });
      expect(result).toBe("flow:create-order");
    })
  // ── END TARGET TEST ─────────────────────────────
});