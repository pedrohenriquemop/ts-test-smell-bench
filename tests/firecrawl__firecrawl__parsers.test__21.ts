it.concurrent(
      "bills based on limited pages with maxPages",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", maxPages: 1 }],
          },
          identity,
        );

        // Should bill based on limited pages (1 page = 1 credit)
        expect(response.metadata.creditsUsed).toBe(1);
        expect(response.metadata.numPages).toBe(1);
      },
      scrapeTimeout * 2,
    )