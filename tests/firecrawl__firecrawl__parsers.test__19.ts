it.concurrent(
      "bills correctly with parsers: ['pdf']",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: ["pdf"],
          },
          identity,
        );

        // Should bill based on number of pages when PDF parsing is enabled
        expect(response.metadata.creditsUsed).toBeGreaterThanOrEqual(
          response.metadata.numPages || 1,
        );
      },
      scrapeTimeout * 2,
    )