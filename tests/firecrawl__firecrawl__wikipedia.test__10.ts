it.concurrent(
        "returns links when format is links",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["links"],
            },
            identity,
          );

          expect(response.links).toBeTruthy();
          expect(Array.isArray(response.links)).toBe(true);
          expect(response.links!.length).toBeGreaterThan(0);
        },
        scrapeTimeout,
      )