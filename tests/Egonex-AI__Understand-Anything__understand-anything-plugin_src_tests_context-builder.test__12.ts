import { describe, it, expect } from "vitest";
import { buildChatContext, formatContextForPrompt } from "../context-builder.js";
import type { KnowledgeGraph, GraphNode, GraphEdge, Layer } from "@understand-anything/core";

const makeNode = (
  overrides: Partial<GraphNode> & { id: string; name: string },
): GraphNode => ({
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
    filePath: "src/controllers/auth.ts",
    summary: "Handles user login, logout, and session management",
    tags: ["auth", "controller", "security"],
    complexity: "complex",
    languageNotes: "Uses Express middleware pattern",
  }),
  makeNode({
    id: "db-pool",
    name: "DatabasePool",
    type: "class",
    filePath: "src/db/pool.ts",
    summary: "Manages PostgreSQL connection pooling",
    tags: ["database", "connection"],
    complexity: "moderate",
  }),
  makeNode({
    id: "user-model",
    name: "UserModel",
    type: "class",
    filePath: "src/models/user.ts",
    summary: "ORM model for the users table",
    tags: ["model", "database", "user"],
    complexity: "moderate",
  }),
  makeNode({
    id: "auth-middleware",
    name: "authMiddleware",
    type: "function",
    filePath: "src/middleware/auth.ts",
    summary: "Express middleware that validates JWT tokens for authentication",
    tags: ["auth", "middleware", "security"],
    complexity: "simple",
  }),
  makeNode({
    id: "config",
    name: "config.ts",
    type: "file",
    filePath: "src/config.ts",
    summary: "Application configuration and environment variables",
    tags: ["config", "env"],
    complexity: "simple",
  }),
];
const sampleEdges: GraphEdge[] = [
  {
    source: "auth-ctrl",
    target: "user-model",
    type: "depends_on",
    direction: "forward",
    description: "AuthenticationController uses UserModel for user lookup",
    weight: 0.9,
  },
  {
    source: "auth-ctrl",
    target: "auth-middleware",
    type: "calls",
    direction: "forward",
    description: "Controller registers auth middleware",
    weight: 0.7,
  },
  {
    source: "user-model",
    target: "db-pool",
    type: "depends_on",
    direction: "forward",
    description: "UserModel uses DatabasePool for queries",
    weight: 0.8,
  },
];
const sampleLayers: Layer[] = [
  {
    id: "layer-api",
    name: "API Layer",
    description: "HTTP controllers and middleware",
    nodeIds: ["auth-ctrl", "auth-middleware"],
  },
  {
    id: "layer-data",
    name: "Data Layer",
    description: "Database models and connections",
    nodeIds: ["user-model", "db-pool"],
  },
];
const sampleGraph: KnowledgeGraph = {
  version: "1.0.0",
  project: {
    name: "test-project",
    languages: ["TypeScript"],
    frameworks: ["Express"],
    description: "A test project for unit tests",
    analyzedAt: "2026-03-14T00:00:00Z",
    gitCommitHash: "abc123",
  },
  nodes: sampleNodes,
  edges: sampleEdges,
  layers: sampleLayers,
  tour: [],
};

describe("formatContextForPrompt", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("includes file paths for nodes that have them", () => {
      const ctx = buildChatContext(sampleGraph, "authentication");
      const formatted = formatContextForPrompt(ctx);
      expect(formatted).toContain("src/controllers/auth.ts");
    })
  // ── END TARGET TEST ─────────────────────────────
});