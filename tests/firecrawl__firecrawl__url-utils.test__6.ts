it("should return null for invalid URLs", () => {
      expect(extractBaseDomain("not-a-url")).toBe(null);
      expect(extractBaseDomain("")).toBe(null);
    })