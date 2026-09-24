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


describe("DockerfileParser edge cases", () => {
  const parser = new DockerfileParser();

  // ── TARGET TEST ─────────────────────────────────
  it("assigns EXPOSE ports to the correct stage in multi-stage build", () => {
      const content = "FROM node:22 AS builder\nRUN npm install\n\nFROM node:22-slim AS runner\nCOPY --from=builder /app /app\nEXPOSE 3000 8080\nCMD [\"node\", \"server.js\"]";
      const result = parser.analyzeFile("Dockerfile", content);
      expect(result.services).toBeDefined();
      expect(result.services!).toHaveLength(2);
      // Ports should be on the runner stage (second stage), not the builder
      expect(result.services![0].ports).toHaveLength(0); // builder has no EXPOSE
      expect(result.services![1].ports).toContain(3000);
      expect(result.services![1].ports).toContain(8080);
    })
  // ── END TARGET TEST ─────────────────────────────
});