it.concurrent(
        "returns multiple formats together",
        async () => {
          const response = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["markdown", "html", "links"],
            },
            identity,
          );

          expect(response.markdown).toBeTruthy();
          expect(response.html).toBeTruthy();
          expect(response.links).toBeTruthy();
          expect(response.markdown!.length).toBeGreaterThan(100);
          expect(response.html!.length).toBeGreaterThan(100);
          expect(response.links!.length).toBeGreaterThan(0);
        },
        scrapeTimeout,
      )