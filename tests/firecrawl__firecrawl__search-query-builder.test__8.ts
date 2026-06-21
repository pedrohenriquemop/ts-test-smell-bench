it("should handle special characters in base query", () => {
      const result = buildSearchQuery("C++ programming", ["github"]);
      expect(result.query).toBe("C++ programming (site:github.com)");
    })