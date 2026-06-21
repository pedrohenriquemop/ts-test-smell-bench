it.concurrent(
        "handles URL-encoded special characters (C++)",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/C%2B%2B",
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.metadata.statusCode).toBe(200);
        },
        scrapeTimeout,
      )