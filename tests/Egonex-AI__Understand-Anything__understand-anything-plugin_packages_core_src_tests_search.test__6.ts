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
  it("returns scored results with score between 0 and 1", () => {
      const engine = new SearchEngine(sampleNodes);
      const results = engine.search("database");
      expect(results.length).toBeGreaterThan(0);
      for (const result of results) {
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});