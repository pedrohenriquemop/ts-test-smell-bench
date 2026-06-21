it.concurrent(
        "scrapes a non-English Wikipedia article (Spanish)",
        async () => {
          const response = await scrape(
            {
              url: "https://es.wikipedia.org/wiki/Web_scraping",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(50);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )