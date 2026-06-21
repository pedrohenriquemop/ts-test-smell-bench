it.concurrent(
      "object input produces identical output structure",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: [{ type: "markdown" }, { type: "html" }],
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