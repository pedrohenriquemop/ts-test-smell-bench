import { describe, it, expect } from "vitest";
import { applyScreenThumbnails } from "../thumbnails";
import type { GraphNode } from "../../types";

function node(id: string, type: GraphNode["type"], nodeId: string): GraphNode {
  return {
    id, type, name: id, summary: id, tags: [type], complexity: "simple",
    figmaMeta: { fileKey: "ABC", nodeId },
  };
}

describe("applyScreenThumbnails", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns 0 and mutates nothing when no screens match", () => {
      const nodes: GraphNode[] = [node("screen:9:9", "screen", "9:9")];
      const updated = applyScreenThumbnails(nodes, {});
      expect(updated).toBe(0);
      expect(nodes[0].figmaMeta?.thumbnailUrl).toBeUndefined();
    })
  // ── END TARGET TEST ─────────────────────────────
});