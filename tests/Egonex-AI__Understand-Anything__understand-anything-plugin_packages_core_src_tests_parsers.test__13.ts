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
  it("extracts $ref references", () => {
      const content = '{\n  "$ref": "./common.json#/defs/User"\n}';
      const refs = parser.extractReferences!("schema.json", content);
      expect(refs).toHaveLength(1);
      expect(refs[0]).toMatchObject({ target: "./common.json#/defs/User", referenceType: "schema" });
    })
  // ── END TARGET TEST ─────────────────────────────
});