it.concurrent(
        "returns correct metadata for a Wikipedia article",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["markdown"],
            },
            identity,
          );

          expect(response.metadata).toBeDefined();
          expect(response.metadata.statusCode).toBe(200);
          expect(response.metadata.sourceURL).toBe(
            "https://en.wikipedia.org/wiki/TypeScript",
          );
          expect(response.metadata.title).toBeTruthy();
          expect(response.metadata.description).toBeTruthy();
        },
        scrapeTimeout,
      )