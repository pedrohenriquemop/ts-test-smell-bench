import { describe, it, expect } from "vitest";
import { normalizeNodeId } from "../analyzer/normalize-graph.js";


describe("normalizeNodeId — domain types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes bare step name with filePath", () => {
      const result = normalizeNodeId("validate", {
        type: "step",
        name: "Validate",
        filePath: "src/validators/order.ts",
      });
      expect(result).toBe("step:src/validators/order.ts:validate");
    })
  // ── END TARGET TEST ─────────────────────────────
});