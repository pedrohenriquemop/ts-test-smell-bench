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


describe("SQLParser", () => {
  const parser = new SQLParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts CREATE VIEW", () => {
      const content = "CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;";
      const result = parser.analyzeFile("views.sql", content);
      expect(result.definitions!.some(d => d.name === "active_users" && d.kind === "view")).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});