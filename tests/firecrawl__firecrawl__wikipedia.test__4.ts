it.concurrent(
        "handles abbreviation redirects (e.g. UK -> United Kingdom)",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/UK",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )