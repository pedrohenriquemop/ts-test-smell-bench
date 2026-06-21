it("should return false for URLs with paths", () => {
      expect(isBaseDomain("https://example.com/path")).toBe(false);
      expect(isBaseDomain("https://example.com/path/to/page")).toBe(false);
      expect(isBaseDomain("https://example.com/path?query=1")).toBe(false);
    })