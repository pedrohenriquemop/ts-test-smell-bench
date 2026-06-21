it("should combine categories with domain filters", () => {
      const result = buildSearchQuery("web scraping", ["github"], {
        includeDomains: ["firecrawl.dev"],
      });
      expect(result.query).toBe(
        "web scraping (site:github.com) (site:firecrawl.dev)",
      );
      expect(result.categoryMap.get("github.com")).toBe("github");
    })