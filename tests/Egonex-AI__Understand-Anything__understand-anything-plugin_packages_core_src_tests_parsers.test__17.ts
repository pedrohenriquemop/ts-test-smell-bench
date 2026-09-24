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


describe("JSONConfigParser", () => {
  const parser = new JSONConfigParser();

  // ── TARGET TEST ─────────────────────────────────
  it("parses .jsonc files with line and block comments", () => {
      const content = [
        "{",
        "  // top-level comment",
        '  "name": "wrangler",',
        "  /* block",
        "     comment */",
        '  "main": "src/index.ts",',
        '  "compatibility_date": "2024-01-01",',
        "}", // trailing comma above
      ].join("\n");
      const result = parser.analyzeFile("wrangler.jsonc", content);
      const names = result.sections!.map((s) => s.name);
      expect(names).toEqual(["name", "main", "compatibility_date"]);
    })
  // ── END TARGET TEST ─────────────────────────────
});