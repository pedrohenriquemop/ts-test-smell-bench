it("should handle multiple simple categories", () => {
      const result = buildSearchQuery("firecrawl", ["github", "research"]);
      expect(result.query).toContain("firecrawl (");
      expect(result.query).toContain("site:github.com");
      expect(result.query).toContain("site:arxiv.org");
      expect(result.query).toContain(" OR ");

      expect(result.categoryMap.get("github.com")).toBe("github");
      expect(result.categoryMap.get("arxiv.org")).toBe("research");
      expect(result.categoryMap.size).toBe(15); // 1 GitHub + 14 research
    })