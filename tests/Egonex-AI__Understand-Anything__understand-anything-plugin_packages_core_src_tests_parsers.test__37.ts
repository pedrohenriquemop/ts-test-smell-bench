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
  it("extracts message definitions with fields", () => {
      const content = `message User {
    string name = 1;
    int32 age = 2;
    repeated string emails = 3;
  }`;
      const result = parser.analyzeFile("user.proto", content);
      expect(result.definitions).toBeDefined();
      expect(result.definitions!).toHaveLength(1);
      expect(result.definitions![0]).toMatchObject({ name: "User", kind: "message" });
      expect(result.definitions![0].fields).toContain("name");
      expect(result.definitions![0].fields).toContain("age");
      expect(result.definitions![0].fields).toContain("emails");
    })
  // ── END TARGET TEST ─────────────────────────────
});