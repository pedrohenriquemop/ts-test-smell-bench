import { describe, it, expect } from "vitest";
import { normalizeNodeId } from "../analyzer/normalize-graph.js";


describe("normalizeNodeId — domain types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes domain node IDs", () => {
      const result = normalizeNodeId("domain:order-management", {
        type: "domain",
        name: "Order Management",
      });
      expect(result).toBe("domain:order-management");
    })
  // ── END TARGET TEST ─────────────────────────────
});