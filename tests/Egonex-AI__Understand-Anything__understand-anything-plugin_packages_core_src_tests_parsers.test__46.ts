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


describe("ShellParser", () => {
  const parser = new ShellParser();

  // ── TARGET TEST ─────────────────────────────────
  it("extracts function definitions", () => {
      const content = "#!/bin/bash\n\ngreet() {\n  echo \"Hello $1\"\n}\n\nfunction cleanup {\n  rm -rf tmp/\n}";
      const result = parser.analyzeFile("script.sh", content);
      expect(result.functions).toHaveLength(2);
      expect(result.functions[0].name).toBe("greet");
      expect(result.functions[1].name).toBe("cleanup");
    })
  // ── END TARGET TEST ─────────────────────────────
});