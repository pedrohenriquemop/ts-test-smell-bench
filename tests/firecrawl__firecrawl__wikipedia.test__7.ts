it.concurrent(
        "returns markdown when format is markdown",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["markdown"],
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.markdown).toContain("TypeScript");
          expect(response.html).toBeUndefined();
          expect(response.rawHtml).toBeUndefined();
        },
        scrapeTimeout,
      )