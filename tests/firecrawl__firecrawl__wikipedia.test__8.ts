it.concurrent(
        "returns html when format is html",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["html"],
            },
            identity,
          );

          expect(response.html).toBeTruthy();
          expect(response.html!.length).toBeGreaterThan(100);
          expect(response.html).toContain("TypeScript");
          expect(response.markdown).toBeUndefined();
        },
        scrapeTimeout,
      )