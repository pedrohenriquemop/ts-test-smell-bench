import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("createDefault", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("registers Swift with tree-sitter grammar metadata", () => {
          const registry = LanguageRegistry.createDefault();
          expect(registry.getById("swift")?.treeSitter).toEqual({
            wasmPackage: "@understand-anything/tree-sitter-swift-wasm",
            wasmFile: "tree-sitter-swift.wasm",
          });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});