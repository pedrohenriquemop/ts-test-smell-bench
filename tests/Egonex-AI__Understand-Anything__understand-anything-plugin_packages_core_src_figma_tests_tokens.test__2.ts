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

describe("extractTokens — nested styled layers", () => {
  const nestedDoc: FigmaDocument = {
      name: "MyApp",
      document: {
        id: "0:0", name: "Document", type: "DOCUMENT", children: [
          { id: "1:0", name: "Home", type: "CANVAS", children: [
            { id: "10:0", name: "Home Screen", type: "FRAME", children: [
              { id: "11:0", name: "Title", type: "TEXT", styles: { text: "200:1" }, children: [] },
            ] },
          ] },
        ],
      },
      styles: { "200:1": { key: "T_KEY", name: "type/heading", styleType: "TEXT" } },
    };
  const nestedStyles: FigmaStyles = { meta: { styles: [{ key: "T_KEY", name: "type/heading", style_type: "TEXT" }] } };
  const nestedStructural: GraphNode[] = [
      { id: "screen:10:0", type: "screen", name: "Home Screen", summary: "Home Screen", tags: ["screen"], complexity: "simple", figmaMeta: { fileKey: "ABC", nodeId: "10:0" } },
    ];

  // ── TARGET TEST ─────────────────────────────────
  it("attributes nested-layer token usage to the nearest structural ancestor (screen)", () => {
      const { nodes, edges } = extractTokens(nestedDoc, nestedStyles, nestedStructural, "ABC");
      const token = nodes.find((n) => n.type === "token");
      expect(token).toBeTruthy();
      expect(edges).toEqual(expect.arrayContaining([
        expect.objectContaining({ source: "screen:10:0", target: token!.id, type: "uses_token" }),
      ]));
    })
  // ── END TARGET TEST ─────────────────────────────
});