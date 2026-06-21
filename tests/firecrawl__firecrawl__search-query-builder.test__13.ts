it("should add exclude domain filters", () => {
      const result = buildSearchQuery("web scraping", undefined, {
        excludeDomains: ["example.com", "spam.example.com"],
      });
      expect(result.query).toBe(
        "web scraping -site:example.com -site:spam.example.com",
      );
      expect(result.categoryMap.size).toBe(0);
    })