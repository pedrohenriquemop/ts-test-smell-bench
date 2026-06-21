it.concurrent(
      "accepts mode: 'ocr' and parses PDF via OCR",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", mode: "ocr" }],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("PDF Test File");
        expect(response.metadata.numPages).toBeGreaterThan(0);
      },
      scrapeTimeout * 2,
    )