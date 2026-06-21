it("should add GitHub filter for simple github category", () => {
      const result = buildSearchQuery("web scraping", ["github"]);
      expect(result.query).toBe("web scraping (site:github.com)");
      expect(result.categoryMap.get("github.com")).toBe("github");
      expect(result.categoryMap.size).toBe(1);
    })