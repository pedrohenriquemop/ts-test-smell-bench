it.concurrent(
      "accepts parsers: [{type: 'pdf', maxPages: 1}] and limits pages",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", maxPages: 1 }],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBe(1);
      },
      scrapeTimeout * 2,
    )