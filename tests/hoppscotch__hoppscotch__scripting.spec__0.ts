test("strips 'export {};\\n' prefix", () => {
      expect(stripModulePrefix("export {};\nconst x = 1;")).toBe(
        "const x = 1;"
      );
    })