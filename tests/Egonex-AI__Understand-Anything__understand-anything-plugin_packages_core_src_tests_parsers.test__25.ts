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


describe("TOMLParser", () => {
  const parser = new TOMLParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts section headers", () => {
      const content = "[package]\nname = \"my-app\"\n\n[dependencies]\nfoo = \"1.0\"\n\n[[bin]]\nname = \"cli\"";
      const result = parser.analyzeFile("Cargo.toml", content);
      expect(result.sections).toBeDefined();
      expect(result.sections!.length).toBe(3);
      expect(result.sections![0].name).toBe("package");
      expect(result.sections![1].name).toBe("dependencies");
      expect(result.sections![2].name).toBe("[[bin]]");
    })
  // ── END TARGET TEST ─────────────────────────────
});