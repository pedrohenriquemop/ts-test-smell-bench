it.concurrent(
      "accepts parsers: ['pdf'] on HTML pages (no effect)",
      async () => {
        const response = await scrape(
          {
            url: htmlUrl,
            parsers: ["pdf"],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("Firecrawl");
      },
      scrapeTimeout,
    )