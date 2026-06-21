test("returns script unchanged if no prefix", () => {
      expect(stripModulePrefix("const x = 1;")).toBe("const x = 1;");
    })