it("should add include domain filters", () => {
      const result = buildSearchQuery("web scraping", undefined, {
        includeDomains: ["firecrawl.dev", "docs.firecrawl.dev"],
      });
      expect(result.query).toBe(
        "web scraping (site:firecrawl.dev OR site:docs.firecrawl.dev)",
      );
      expect(result.categoryMap.size).toBe(0);
    })