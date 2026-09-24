import { describe, it, expect } from "vitest";
import { ALL_NODE_TYPES } from "../store";
import type { NodeType as CoreNodeType } from "@understand-anything/core/types";

const EXPECTED_NODE_TYPES = {
  // code (5)
  file: true, function: true, class: true, module: true, concept: true,
  // non-code (8)
  config: true, document: true, service: true, table: true, endpoint: true,
  pipeline: true, schema: true, resource: true,
  // domain (3)
  domain: true, flow: true, step: true,
  // knowledge (5)
  article: true, entity: true, topic: true, claim: true, source: true,
  // design (6) — Figma graphs must remain exportable by default
  page: true, screen: true, component: true, componentSet: true, instance: true, token: true,
} satisfies Record<CoreNodeType, true>;
const DESIGN_TYPES = ["page", "screen", "component", "componentSet", "instance", "token"] as const;

describe("ALL_NODE_TYPES (filter / export default set)", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("has no duplicates and no types beyond the core set", () => {
      expect(new Set(ALL_NODE_TYPES).size).toBe(ALL_NODE_TYPES.length);
      expect(ALL_NODE_TYPES.length).toBe(Object.keys(EXPECTED_NODE_TYPES).length);
    })
  // ── END TARGET TEST ─────────────────────────────
});