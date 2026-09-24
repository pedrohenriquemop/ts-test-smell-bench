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


describe("EnvParser edge cases", () => {
  const parser = new EnvParser();

  // ── TARGET TEST ─────────────────────────────────
  it("does not handle export VAR=value syntax", () => {
      const content = "export DB_HOST=localhost\nAPI_KEY=secret";
      const result = parser.analyzeFile(".env", content);
      // The `export` prefix is not handled — only plain KEY=value is parsed
      const names = result.definitions!.map(d => d.name);
      expect(names).toContain("API_KEY");
      expect(names).not.toContain("DB_HOST");
    })
  // ── END TARGET TEST ─────────────────────────────
});