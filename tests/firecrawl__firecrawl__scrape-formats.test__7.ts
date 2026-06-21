it.concurrent(
      "maintains backward compatibility with string-only formats",
      async () => {
        const response = await scrape(
          {
            url: base,
            formats: ["markdown", "html", "rawHtml", "links"],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.html).toBeDefined();
        expect(response.rawHtml).toBeDefined();
        expect(response.links).toBeDefined();
      },
      scrapeTimeout,
    )