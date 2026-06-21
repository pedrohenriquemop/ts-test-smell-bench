test("legacy target generates sync IIFE chain with no await", () => {
      const result = combineScriptsWithIIFE(
        ["const a = 1;", "const b = 2;", "const c = 3;"],
        "legacy"
      );

      // No `async` keyword, no `await` — legacy sandbox is sync-only.
      expect(result).not.toContain("async");
      expect(result).not.toContain("await");
      // Leading `;` guards against ASI on the host script.
      expect(result).toMatch(/^;\(function\(\) \{/);
      // Each script wrapped in its own IIFE
      const iifeCount = (result.match(/\.call\(this\);/g) || []).length;
      expect(iifeCount).toBe(3);
    })