test("returns empty string when all scripts are empty", () => {
      expect(combineScriptsWithIIFE(["", "  ", "\n"])).toBe("");
    })