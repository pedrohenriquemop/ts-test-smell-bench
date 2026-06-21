test("strips module prefix from scripts before wrapping", () => {
      const script = `${MODULE_PREFIX}const x = 1;`;

      const result = combineScriptsWithIIFE([script]);

      // The module prefix should be stripped
      expect(result).not.toContain("export {};");
      expect(result).toContain("const x = 1;");
    })