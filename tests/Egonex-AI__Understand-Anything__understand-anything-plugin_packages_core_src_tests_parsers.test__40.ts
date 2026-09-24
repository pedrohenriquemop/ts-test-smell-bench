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
  it("extracts resource blocks", () => {
      const content = `resource "aws_s3_bucket" "main" {
    bucket = "my-bucket"
  }

  resource "aws_iam_role" "lambda" {
    name = "lambda-role"
  }`;
      const result = parser.analyzeFile("main.tf", content);
      expect(result.resources).toBeDefined();
      expect(result.resources!).toHaveLength(2);
      expect(result.resources![0]).toMatchObject({ name: "aws_s3_bucket.main", kind: "aws_s3_bucket" });
      expect(result.resources![1]).toMatchObject({ name: "aws_iam_role.lambda", kind: "aws_iam_role" });
    })
  // ── END TARGET TEST ─────────────────────────────
});