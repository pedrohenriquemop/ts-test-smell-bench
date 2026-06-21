it.concurrent(
      "mixed input produces consistent output",
      async () => {
        const response1 = await scrape(
          {
            url: base,
            formats: ["markdown", "html"],
          },
          identity,
        );

        const response2 = await scrape(
          {
            url: base,
            formats: [{ type: "markdown" }, { type: "html" }],
          },
          identity,
        );

        const response3 = await scrape(
          {
            url: base,
            formats: ["markdown", { type: "html" }],
          },
          identity,
        );

        expect(Object.keys(response1).sort()).toEqual(
          Object.keys(response2).sort(),
        );
        expect(Object.keys(response2).sort()).toEqual(
          Object.keys(response3).sort(),
        );
      },
      scrapeTimeout,
    )