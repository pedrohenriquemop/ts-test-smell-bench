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


describe("registerAllParsers", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("registers all 12 parsers with a PluginRegistry", () => {
      const registry = new PluginRegistry();
      registerAllParsers(registry);
      expect(registry.getPlugins()).toHaveLength(12);
      expect(registry.getSupportedLanguages()).toContain("markdown");
      expect(registry.getSupportedLanguages()).toContain("yaml");
      expect(registry.getSupportedLanguages()).toContain("json");
      expect(registry.getSupportedLanguages()).toContain("toml");
      expect(registry.getSupportedLanguages()).toContain("env");
      expect(registry.getSupportedLanguages()).toContain("dockerfile");
      expect(registry.getSupportedLanguages()).toContain("sql");
      expect(registry.getSupportedLanguages()).toContain("graphql");
      expect(registry.getSupportedLanguages()).toContain("protobuf");
      expect(registry.getSupportedLanguages()).toContain("terraform");
      expect(registry.getSupportedLanguages()).toContain("makefile");
      expect(registry.getSupportedLanguages()).toContain("shell");
    })
  // ── END TARGET TEST ─────────────────────────────
});