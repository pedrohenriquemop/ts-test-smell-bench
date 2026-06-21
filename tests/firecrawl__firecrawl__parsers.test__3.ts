it.concurrent(
      "accepts empty parsers array on HTML pages",
      async () => {
        const response = await scrape(
          {
            url: htmlUrl,
            parsers: [],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("Firecrawl");
      },
      scrapeTimeout,
    )