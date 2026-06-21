it("should handle quotes in base query", () => {
      const result = buildSearchQuery('"exact phrase" search', ["github"]);
      expect(result.query).toBe('"exact phrase" search (site:github.com)');
    })