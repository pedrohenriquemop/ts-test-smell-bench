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


describe("ProtobufParser", () => {
  const parser = new ProtobufParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts enum definitions", () => {
      const content = "enum Status {\n  UNKNOWN = 0;\n  ACTIVE = 1;\n  INACTIVE = 2;\n}";
      const result = parser.analyzeFile("status.proto", content);
      expect(result.definitions!.some(d => d.name === "Status" && d.kind === "enum")).toBe(true);
      expect(result.definitions![0].fields).toContain("UNKNOWN");
      expect(result.definitions![0].fields).toContain("ACTIVE");
    })
  // ── END TARGET TEST ─────────────────────────────
});