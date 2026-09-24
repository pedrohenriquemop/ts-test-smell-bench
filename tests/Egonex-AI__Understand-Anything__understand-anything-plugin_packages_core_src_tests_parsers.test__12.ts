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
  it("extracts top-level key sections", () => {
      const content = '{\n  "name": "my-app",\n  "version": "1.0",\n  "dependencies": {}\n}';
      const result = parser.analyzeFile("package.json", content);
      expect(result.sections).toBeDefined();
      expect(result.sections!.map(s => s.name)).toContain("name");
      expect(result.sections!.map(s => s.name)).toContain("dependencies");
    })
  // ── END TARGET TEST ─────────────────────────────
});