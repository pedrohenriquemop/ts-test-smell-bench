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
  it("ignores headings inside fenced code blocks", () => {
      // Regression: lines inside ``` blocks that look like shell comments
      // (`# install`, `# build`) used to register as level-1 sections.
      const content = [
        "# Real Title",
        "",
        "Some intro.",
        "",
        "```bash",
        "# install",
        "npm install",
        "# build",
        "npm run build",
        "```",
        "",
        "## Real Section",
      ].join("\n");
      const result = parser.analyzeFile("README.md", content);
      expect(result.sections!.map((s) => s.name)).toEqual(["Real Title", "Real Section"]);
    })
  // ── END TARGET TEST ─────────────────────────────
});