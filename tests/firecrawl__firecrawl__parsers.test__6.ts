it.concurrent(
      "handles maxPages larger than actual pages",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", maxPages: 10000 }],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBeGreaterThan(0);
        expect(response.metadata.numPages).toBeLessThan(10000);
      },
      scrapeTimeout * 2,
    )