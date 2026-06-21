it.concurrent(
        "fails gracefully for non-existent Wikipedia article",
        async () => {
          const response = await scrapeRaw(
            {
              url: "https://en.wikipedia.org/wiki/ThisArticleDefinitelyDoesNotExist_XYZZY_123456789",
            },
            identity,
          );

          expect(response.statusCode).not.toBe(200);
        },
        scrapeTimeout,
      )