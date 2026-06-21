it("should handle complex domains", () => {
      expect(extractBaseDomain("https://subdomain.example.co.uk")).toBe(
        "example.co.uk",
      );
      expect(extractBaseDomain("https://www.example.co.uk")).toBe(
        "example.co.uk",
      );
      expect(extractBaseDomain("https://subdomain.example.com")).toBe(
        "example.com",
      );
      expect(extractBaseDomain("https://www.example.com")).toBe("example.com");
    })