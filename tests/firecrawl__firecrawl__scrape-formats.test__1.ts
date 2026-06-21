it.concurrent(
      "accepts multiple string formats",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: ["markdown", "html", "links"],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.html).toBeDefined();
        expect(response.links).toBeDefined();
        expect(Array.isArray(response.links)).toBe(true);
      },
      scrapeTimeout,
    )