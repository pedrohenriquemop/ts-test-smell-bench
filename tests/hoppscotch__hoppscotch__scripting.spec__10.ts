test("isolates variable scope between scripts (each wrapped in its own function)", () => {
      const script1 = "const x = 1;";
      const script2 = "const x = 2;";

      const result = combineScriptsWithIIFE([script1, script2]);

      // Both scripts should appear in separate async functions
      const fnCount = (result.match(/async function\(\)/g) || []).length;
      expect(fnCount).toBe(2);
    })