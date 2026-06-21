it.concurrent(
      "accepts parsers: [] and returns PDF in base64",
      async () => {
        const response = await scrape(
          {
            url: pdfUrl,
            parsers: [],
          },
          identity,
        );

        expect(response.markdown).toBeDefined();
        expect(response.markdown).toContain("JVBER"); // base64
      },
      scrapeTimeout * 2,
    )