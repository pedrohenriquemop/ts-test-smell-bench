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
  it("extracts type definitions", () => {
      const content = `type User {
    id: ID!
    name: String!
    email: String!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }`;
      const result = parser.analyzeFile("schema.graphql", content);
      expect(result.definitions).toBeDefined();
      expect(result.definitions!).toHaveLength(2);
      expect(result.definitions![0]).toMatchObject({ name: "User", kind: "type" });
      expect(result.definitions![0].fields).toContain("id");
      expect(result.definitions![0].fields).toContain("name");
      expect(result.definitions![1]).toMatchObject({ name: "Post", kind: "type" });
    })
  // ── END TARGET TEST ─────────────────────────────
});