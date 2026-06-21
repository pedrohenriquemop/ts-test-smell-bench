it("should handle mixed string and object categories", () => {
      const result = buildSearchQuery("AI research", [
        "github",
        {
          type: "research",
          sites: ["arxiv.org"],
        },
      ]);
      expect(result.query).toBe(
        "AI research (site:github.com OR site:arxiv.org)",
      );
      expect(result.categoryMap.get("github.com")).toBe("github");
      expect(result.categoryMap.get("arxiv.org")).toBe("research");
      expect(result.categoryMap.size).toBe(2);
    })