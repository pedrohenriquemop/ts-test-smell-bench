it("should use custom research sites when provided", () => {
      const result = buildSearchQuery("quantum computing", [
        {
          type: "research",
          sites: ["arxiv.org", "nature.com"],
        },
      ]);
      expect(result.query).toBe(
        "quantum computing (site:arxiv.org OR site:nature.com)",
      );
      expect(result.categoryMap.size).toBe(2);
      expect(result.categoryMap.get("arxiv.org")).toBe("research");
      expect(result.categoryMap.get("nature.com")).toBe("research");
    })