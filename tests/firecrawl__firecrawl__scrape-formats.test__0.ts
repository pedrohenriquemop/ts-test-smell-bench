it.concurrent(
      "accepts string format for markdown",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: [{ type: "markdown" }],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(typeof response.markdown).toBe("string");
        expect(response.markdown?.length).toBeGreaterThan(0);
      },
      scrapeTimeout,
    )