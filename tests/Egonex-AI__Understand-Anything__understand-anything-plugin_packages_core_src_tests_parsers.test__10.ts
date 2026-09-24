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


describe("YAMLConfigParser", () => {
  const parser = new YAMLConfigParser();

  // ── TARGET TEST ─────────────────────────────────
  it("recognizes quoted top-level keys (e.g. GitHub Actions `\"on\"`)", () => {
      const content = '"on":\n  push:\n    branches: [main]\nname: ci\n';
      const result = parser.analyzeFile(".github/workflows/ci.yml", content);
      expect(result.sections!.map((s) => s.name)).toEqual(expect.arrayContaining(["on", "name"]));
    })
  // ── END TARGET TEST ─────────────────────────────
});