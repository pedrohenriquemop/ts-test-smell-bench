it.concurrent(
      "accepts parsers: ['pdf'] and parses PDF",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: ["pdf"],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBeGreaterThan(0);
      },
      scrapeTimeout * 2,
    )