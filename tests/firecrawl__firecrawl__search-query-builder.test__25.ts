it("should handle complex real-world query", () => {
      const result = buildSearchQuery(
        'machine learning "neural networks" site:stackoverflow.com',
        ["github", "research"],
      );

      // Should append category filters to existing query
      expect(result.query).toContain(
        'machine learning "neural networks" site:stackoverflow.com',
      );
      expect(result.query).toContain("(site:github.com OR site:arxiv.org");

      // Check URLs can be categorized
      const githubUrl = "https://github.com/tensorflow/tensorflow";
      const arxivUrl = "https://arxiv.org/abs/2024.12345";

      expect(getCategoryFromUrl(githubUrl, result.categoryMap)).toBe("github");
      expect(getCategoryFromUrl(arxivUrl, result.categoryMap)).toBe("research");
    })