it.concurrent(
        "handles Wikipedia redirect pages (e.g. Brasil -> Brazil)",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/Brasil",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )