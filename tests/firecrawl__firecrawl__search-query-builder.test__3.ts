it("should add default research sites for simple research category", () => {
      const result = buildSearchQuery("neural networks", ["research"]);
      expect(result.query).toContain("neural networks (");
      expect(result.query).toContain("site:arxiv.org");
      expect(result.query).toContain("site:nature.com");
      expect(result.query).toContain("site:ieee.org");
      expect(result.query).toContain(" OR ");

      // Check category map
      expect(result.categoryMap.get("arxiv.org")).toBe("research");
      expect(result.categoryMap.get("nature.com")).toBe("research");
      expect(result.categoryMap.size).toBe(14); // All default research sites
    })