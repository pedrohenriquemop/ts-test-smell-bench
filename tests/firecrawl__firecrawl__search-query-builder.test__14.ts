it("should ignore empty domain filter arrays", () => {
      const result = buildSearchQuery("web scraping", undefined, {
        includeDomains: [],
        excludeDomains: [],
      });
      expect(result.query).toBe("web scraping");
      expect(result.categoryMap.size).toBe(0);
    })