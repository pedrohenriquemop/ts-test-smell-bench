it.concurrent(
        "respects onlyMainContent option",
        async () => {
          const withMainContent = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["markdown"],
              onlyMainContent: true,
            },
            identity,
          );

          const withoutMainContent = await scrape(
            {
              url: "https://en.wikipedia.org/wiki/TypeScript",
              formats: ["markdown"],
              onlyMainContent: false,
            },
            identity,
          );

          expect(withMainContent.markdown).toBeTruthy();
          expect(withoutMainContent.markdown).toBeTruthy();
          // Full content should be equal to or longer than main-only content
          expect(withoutMainContent.markdown!.length).toBeGreaterThanOrEqual(
            withMainContent.markdown!.length,
          );
        },
        scrapeTimeout * 2,
      )