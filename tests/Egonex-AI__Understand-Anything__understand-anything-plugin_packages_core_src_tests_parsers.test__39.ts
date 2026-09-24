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
  it("extracts service RPC methods", () => {
      const content = `service UserService {
    rpc GetUser (GetUserRequest) returns (User);
    rpc CreateUser (CreateUserRequest) returns (User);
  }`;
      const result = parser.analyzeFile("service.proto", content);
      expect(result.endpoints).toBeDefined();
      expect(result.endpoints!).toHaveLength(2);
      expect(result.endpoints![0]).toMatchObject({ method: "rpc", path: "UserService.GetUser" });
      expect(result.endpoints![1]).toMatchObject({ method: "rpc", path: "UserService.CreateUser" });
    })
  // ── END TARGET TEST ─────────────────────────────
});