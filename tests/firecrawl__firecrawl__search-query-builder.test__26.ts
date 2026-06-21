it("should handle empty query with categories", () => {
      const result = buildSearchQuery("", ["github"]);
      expect(result.query).toBe(" (site:github.com)");
    })