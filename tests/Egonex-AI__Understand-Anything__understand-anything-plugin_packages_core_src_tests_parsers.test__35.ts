import { describe, it, expect } from "vitest";
import { MarkdownParser } from "../plugins/parsers/markdown-parser.js";
import { YAMLConfigParser } from "../plugins/parsers/yaml-parser.js";
import { JSONConfigParser, stripJsoncSyntax } from "../plugins/parsers/json-parser.js";
import { TOMLParser } from "../plugins/parsers/toml-parser.js";
import { EnvParser } from "../plugins/parsers/env-parser.js";
import { DockerfileParser } from "../plugins/parsers/dockerfile-parser.js";
import { SQLParser } from "../plugins/parsers/sql-parser.js";
import { GraphQLParser } from "../plugins/parsers/graphql-parser.js";
import { ProtobufParser } from "../plugins/parsers/protobuf-parser.js";
import { TerraformParser } from "../plugins/parsers/terraform-parser.js";
import { MakefileParser } from "../plugins/parsers/makefile-parser.js";
import { ShellParser } from "../plugins/parsers/shell-parser.js";
import { registerAllParsers } from "../plugins/parsers/index.js";
import { PluginRegistry } from "../plugins/registry.js";


describe("GraphQLParser", () => {
  const parser = new GraphQLParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts Query/Mutation endpoints", () => {
      const content = `type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!): User!
  }`;
      const result = parser.analyzeFile("schema.graphql", content);
      expect(result.endpoints).toBeDefined();
      expect(result.endpoints!.length).toBeGreaterThanOrEqual(3);
      expect(result.endpoints!.some(e => e.method === "Query" && e.path === "users")).toBe(true);
      expect(result.endpoints!.some(e => e.method === "Mutation" && e.path === "createUser")).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});