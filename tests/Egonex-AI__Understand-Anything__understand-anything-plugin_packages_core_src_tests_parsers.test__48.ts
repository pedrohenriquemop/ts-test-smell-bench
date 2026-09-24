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


describe("SQLParser edge cases", () => {
  const parser = new SQLParser();

  // ── TARGET TEST ─────────────────────────────────
  it("handles CREATE TABLE IF NOT EXISTS", () => {
      const content = "CREATE TABLE IF NOT EXISTS users (id INT);";
      const result = parser.analyzeFile("schema.sql", content);
      expect(result.definitions).toBeDefined();
      expect(result.definitions!).toHaveLength(1);
      expect(result.definitions![0]).toMatchObject({ name: "users", kind: "table" });
      expect(result.definitions![0].fields).toContain("id");
    })
  // ── END TARGET TEST ─────────────────────────────
});