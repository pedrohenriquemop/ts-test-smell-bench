import { describe, it, expect } from "vitest";
import { normalizeNodeId } from "../analyzer/normalize-graph.js";


describe("normalizeNodeId — domain types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes step node IDs without filePath", () => {
      const result = normalizeNodeId("step:validate", {
        type: "step",
        name: "Validate",
      });
      expect(result).toBe("step:validate");
    })
  // ── END TARGET TEST ─────────────────────────────
});