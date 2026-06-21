test("filters out empty scripts while preserving non-empty ones", () => {
      const script1 = "const a = 1;";
      const script2 = "const b = 2;";

      const result = combineScriptsWithIIFE([script1, "", "  ", script2]);

      expect(result).toContain(script1);
      expect(result).toContain(script2);

      // Should only have 2 await statements (not 4)
      const awaitCount = (result.match(/await/g) || []).length;
      expect(awaitCount).toBe(2);
    })