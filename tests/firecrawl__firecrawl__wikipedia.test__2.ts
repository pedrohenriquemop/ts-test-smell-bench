it.concurrent(
        "scrapes a non-English Wikipedia article (French)",
        async () => {
          const response = await scrape(
            {
              url: "https://fr.wikipedia.org/wiki/France",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )