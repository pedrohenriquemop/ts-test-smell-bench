import { describe, it, expect } from "vitest";
import { normalizeNodeId } from "../analyzer/normalize-graph.js";


describe("normalizeNodeId — domain types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes step node IDs with filePath", () => {
      const result = normalizeNodeId("step:create-order:validate", {
        type: "step",
        name: "Validate",
        filePath: "src/validators/order.ts",
      });
      expect(result).toBe("step:create-order:src/validators/order.ts:validate");
    })
  // ── END TARGET TEST ─────────────────────────────
});