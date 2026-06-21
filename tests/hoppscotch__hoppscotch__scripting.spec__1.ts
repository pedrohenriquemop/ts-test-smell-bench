test("strips 'export {};' prefix without newline", () => {
      expect(stripModulePrefix("export {};const x = 1;")).toBe("const x = 1;");
    })