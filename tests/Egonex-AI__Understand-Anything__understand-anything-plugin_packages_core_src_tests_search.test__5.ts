import { describe, it, expect } from "vitest";
import { SearchEngine } from "../search.js";
import type { GraphNode } from "../types.js";

const makeNode = (overrides: Partial<GraphNode> & { id: string; name: string }): GraphNode => ({
  type: "file",
  summary: "",
  tags: [],
  complexity: "simple",
  ...overrides,
});
const sampleNodes: GraphNode[] = [
  makeNode({
    id: "auth-ctrl",
    name: "AuthenticationController",
    type: "class",
    summary: "Handles user login, logout, and session management",
    tags: ["auth", "controller", "security"],
    languageNotes: "Uses Express middleware pattern",
  }),
  makeNode({
    id: "db-pool",
    name: "DatabasePool",
    type: "class",
    summary: "Manages PostgreSQL connection pooling",
    tags: ["database", "connection"],
  }),
  makeNode({
    id: "user-model",
    name: "UserModel",
    type: "class",
    summary: "ORM model for the users table",
    tags: ["model", "database", "user"],
  }),
  makeNode({
    id: "config",
    name: "config.ts",
    type: "file",
    summary: "Application configuration and environment variables",
    tags: ["config", "env"],
  }),
  makeNode({
    id: "helpers",
    name: "helpers.ts",
    type: "function",
    summary: "Utility helper functions for string manipulation",
    tags: ["utils", "helpers"],
  }),
  makeNode({
    id: "auth-middleware",
    name: "authMiddleware",
    type: "function",
    summary: "Express middleware that validates JWT tokens for authentication",
    tags: ["auth", "middleware", "security"],
  }),
];

describe("SearchEngine", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("ranks name matches higher than summary matches", () => {
      const engine = new SearchEngine(sampleNodes);
      const results = engine.search("UserModel");
      expect(results.length).toBeGreaterThan(0);
      // UserModel is an exact name match; it should rank first
      expect(results[0].nodeId).toBe("user-model");
    })
  // ── END TARGET TEST ─────────────────────────────
});