it("should return true for base domains", () => {
      expect(isBaseDomain("https://example.com")).toBe(true);
      expect(isBaseDomain("https://www.example.com")).toBe(true);
      expect(isBaseDomain("https://example.co.uk")).toBe(true);
      expect(isBaseDomain("https://www.example.co.uk")).toBe(true);
      expect(isBaseDomain("http://example.com")).toBe(true);
      expect(isBaseDomain("https://example.com/")).toBe(true);
    })