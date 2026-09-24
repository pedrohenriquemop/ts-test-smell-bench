import { describe, it, expect } from "vitest";
import { extractTokens } from "../parse/tokens";
import type { FigmaDocument, FigmaStyles } from "../source/types";
import type { GraphNode } from "../../types";

const doc: FigmaDocument = {
  name: "MyApp",
  document: {
    id: "0:0", name: "Document", type: "DOCUMENT", children: [
      { id: "1:9", name: "Components", type: "CANVAS", children: [
        { id: "2:1", name: "Primary", type: "COMPONENT", styles: { fill: "100:1" }, children: [] },
      ] },
    ],
  },
  styles: { "100:1": { key: "S_KEY", name: "color/brand-500", styleType: "FILL" } },
};
const styles: FigmaStyles = { meta: { styles: [{ key: "S_KEY", name: "color/brand-500", style_type: "FILL" }] } };
const structural: GraphNode[] = [
  { id: "component:2:1", type: "component", name: "Primary", summary: "Primary", tags: ["component"], complexity: "simple", figmaMeta: { fileKey: "ABC", nodeId: "2:1" } },
];

describe("extractTokens", () => {
  const { nodes, edges } = extractTokens(doc, styles, structural, "ABC");

  // ── TARGET TEST ─────────────────────────────────
  it("creates a token node per published style with tokenKind", () => {
      const token = nodes.find((n) => n.type === "token");
      expect(token).toBeTruthy();
      expect(token!.figmaMeta?.tokenKind).toBe("color");
      expect(token!.name).toBe("color/brand-500");
    })
  // ── END TARGET TEST ─────────────────────────────
});