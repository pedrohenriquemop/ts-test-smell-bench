it.concurrent(
      "default format is markdown when formats not specified",
      async () => {
        const response = await scrape(
          {
            url: base,
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(typeof response.markdown).toBe("string");
      },
      scrapeTimeout,
    )