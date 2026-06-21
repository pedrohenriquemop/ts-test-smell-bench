it.concurrent(
      "parses PDF by default when parsers not specified",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBeGreaterThan(0);
      },
      scrapeTimeout * 2,
    )