import { describe, it, expect } from "vitest";
import { validateGraph } from "../schema.js";
import type { KnowledgeGraph } from "../types.js";

const domainGraph: KnowledgeGraph = {
  version: "1.0.0",
  project: {
    name: "test-project",
    languages: ["typescript"],
    frameworks: [],
    description: "A test project",
    analyzedAt: "2026-04-01T00:00:00.000Z",
    gitCommitHash: "abc123",
  },
  nodes: [
    {
      id: "domain:order-management",
      type: "domain",
      name: "Order Management",
      summary: "Handles order lifecycle",
      tags: ["core"],
      complexity: "complex",
    },
    {
      id: "flow:create-order",
      type: "flow",
      name: "Create Order",
      summary: "Customer submits a new order",
      tags: ["write-path"],
      complexity: "moderate",
      domainMeta: {
        entryPoint: "POST /api/orders",
        entryType: "http",
      },
    },
    {
      id: "step:create-order:validate",
      type: "step",
      name: "Validate Input",
      summary: "Checks request body",
      tags: ["validation"],
      complexity: "simple",
      filePath: "src/validators/order.ts",
      lineRange: [10, 30],
    },
  ],
  edges: [
    {
      source: "domain:order-management",
      target: "flow:create-order",
      type: "contains_flow",
      direction: "forward",
      weight: 1.0,
    },
    {
      source: "flow:create-order",
      target: "step:create-order:validate",
      type: "flow_step",
      direction: "forward",
      weight: 0.1,
    },
  ],
  layers: [],
  tour: [],
};

describe("domain graph types", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("normalizes domain type aliases", () => {
      const graph = structuredClone(domainGraph);
      (graph.nodes[0] as any).type = "business_domain";
      (graph.nodes[1] as any).type = "business_flow";
      (graph.nodes[2] as any).type = "business_step";
      const result = validateGraph(graph);
      expect(result.success).toBe(true);
      expect(result.data!.nodes[0].type).toBe("domain");
      expect(result.data!.nodes[1].type).toBe("flow");
      expect(result.data!.nodes[2].type).toBe("step");
    })
  // ── END TARGET TEST ─────────────────────────────
});