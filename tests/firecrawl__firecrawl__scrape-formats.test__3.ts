it.concurrent(
      "accepts multiple object formats",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: [
              { type: "markdown" },
              { type: "html" },
              { type: "links" },
            ],
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