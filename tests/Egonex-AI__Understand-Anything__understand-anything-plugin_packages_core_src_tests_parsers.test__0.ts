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


describe("MarkdownParser", () => {
  const parser = new MarkdownParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts heading sections", () => {
      const content = "# Title\n\nIntro\n\n## Section A\n\nContent A\n\n### Subsection\n\nContent B";
      const result = parser.analyzeFile("README.md", content);
      expect(result.sections).toHaveLength(3);
      expect(result.sections![0]).toMatchObject({ name: "Title", level: 1 });
      expect(result.sections![1]).toMatchObject({ name: "Section A", level: 2 });
      expect(result.sections![2]).toMatchObject({ name: "Subsection", level: 3 });
    })
  // ── END TARGET TEST ─────────────────────────────
});