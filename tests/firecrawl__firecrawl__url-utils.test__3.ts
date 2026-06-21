it("should return false for invalid URLs", () => {
      expect(isBaseDomain("not-a-url")).toBe(false);
      expect(isBaseDomain("")).toBe(false);
    })