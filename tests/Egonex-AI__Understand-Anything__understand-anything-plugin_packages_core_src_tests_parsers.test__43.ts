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


describe("TerraformParser", () => {
  const parser = new TerraformParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts variables and outputs", () => {
      const content = 'variable "region" {\n  default = "us-east-1"\n}\n\noutput "bucket_arn" {\n  value = aws_s3_bucket.main.arn\n}';
      const result = parser.analyzeFile("variables.tf", content);
      expect(result.definitions).toBeDefined();
      expect(result.definitions!.some(d => d.name === "region" && d.kind === "variable")).toBe(true);
      expect(result.definitions!.some(d => d.name === "bucket_arn" && d.kind === "output")).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});