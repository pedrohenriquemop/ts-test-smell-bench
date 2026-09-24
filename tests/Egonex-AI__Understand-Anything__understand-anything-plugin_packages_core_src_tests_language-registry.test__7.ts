import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("createDefault", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("maps all expected extensions", () => {
          const registry = LanguageRegistry.createDefault();
          expect(registry.getByExtension(".ts")?.id).toBe("typescript");
          expect(registry.getByExtension(".py")?.id).toBe("python");
          expect(registry.getByExtension(".go")?.id).toBe("go");
          expect(registry.getByExtension(".rs")?.id).toBe("rust");
          expect(registry.getByExtension(".java")?.id).toBe("java");
          expect(registry.getByExtension(".rb")?.id).toBe("ruby");
          expect(registry.getByExtension(".php")?.id).toBe("php");
          expect(registry.getByExtension(".swift")?.id).toBe("swift");
          expect(registry.getByExtension(".kt")?.id).toBe("kotlin");
          expect(registry.getByExtension(".scala")?.id).toBe("scala");
          expect(registry.getByExtension(".cs")?.id).toBe("csharp");
          expect(registry.getByExtension(".cpp")?.id).toBe("cpp");
          expect(registry.getByExtension(".c")?.id).toBe("c");
          expect(registry.getByExtension(".h")?.id).toBe("c");
          expect(registry.getByExtension(".lua")?.id).toBe("lua");
          expect(registry.getByExtension(".js")?.id).toBe("javascript");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});