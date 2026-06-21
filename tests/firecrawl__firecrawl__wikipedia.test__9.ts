it.concurrent(
        "returns rawHtml when format is rawHtml",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["rawHtml"],
            },
            identity,
          );

          expect(response.rawHtml).toBeTruthy();
          expect(response.rawHtml!.length).toBeGreaterThan(100);
          expect(response.rawHtml).toContain("TypeScript");
          expect(response.markdown).toBeUndefined();
        },
        scrapeTimeout,
      )