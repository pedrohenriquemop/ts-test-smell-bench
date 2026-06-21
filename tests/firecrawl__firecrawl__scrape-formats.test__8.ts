it.concurrent(
      "string input produces consistent output structure",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: ["markdown", "html"],
          },
          identity,
        );

        const keys = Object.keys(response);
        expect(keys).toContain("markdown");
        expect(keys).toContain("html");
        expect(keys).toContain("metadata");
      },
      scrapeTimeout,
    )