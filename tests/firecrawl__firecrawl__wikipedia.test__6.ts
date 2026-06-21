it.concurrent(
        "handles articles with parentheses (disambiguation)",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/Mercury_(planet)",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )