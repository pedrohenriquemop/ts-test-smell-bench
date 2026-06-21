it("should return false for subdomains", () => {
      expect(isBaseDomain("https://blog.example.com")).toBe(false);
      expect(isBaseDomain("https://api.example.com")).toBe(false);
      expect(isBaseDomain("https://www.blog.example.com")).toBe(false);
    })