it.concurrent(
      "bills flat rate with parsers: []",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [],
          },
          identity,
        );

        // Should bill flat rate (1 credit) when PDF parsing is disabled
        expect(response.metadata.creditsUsed).toBe(1);
      },
      scrapeTimeout * 2,
    )