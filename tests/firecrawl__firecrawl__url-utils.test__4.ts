it("should extract base domain correctly", () => {
      expect(extractBaseDomain("https://example.com")).toBe("example.com");
      expect(extractBaseDomain("https://www.example.com")).toBe("example.com");
      expect(extractBaseDomain("https://blog.example.com")).toBe("example.com");
      expect(extractBaseDomain("https://api.example.com")).toBe("example.com");
      expect(extractBaseDomain("https://example.com/path")).toBe("example.com");
    })