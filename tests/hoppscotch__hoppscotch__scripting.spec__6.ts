test("wraps a single script in a sequential async IIFE", () => {
      const result = combineScriptsWithIIFE(["const x = 1;"]);

      expect(result).toContain("async");
      expect(result).toContain("await");
      expect(result).toContain("const x = 1;");
    })