it.concurrent(
      "accepts mode with maxPages combined",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", mode: "fast", maxPages: 1 }],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBe(1);
      },
      scrapeTimeout * 2,
    )