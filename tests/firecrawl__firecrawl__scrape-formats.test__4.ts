it.concurrent(
      "accepts mixed string and object formats",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: ["markdown", { type: "html" }, "links"],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.html).toBeDefined();
        expect(response.links).toBeDefined();
      },
      scrapeTimeout,
    )