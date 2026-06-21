it.concurrent(
        "scrapes a Wikipedia article and returns markdown by default",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/Web_scraping",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
          expect(response.metadata.sourceURL).toBe(
            "https://en.wikipedia.org/wiki/Web_scraping",
          );
        },
        scrapeTimeout,
      )