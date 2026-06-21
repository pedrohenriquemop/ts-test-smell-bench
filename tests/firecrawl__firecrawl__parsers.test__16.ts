it.concurrent(
      "rejects maxPages over limit",
      async () => {
        const raw = await scrapeRaw(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", maxPages: 10001 }],
          },
          identity,
        );

        expect(raw.statusCode).toBe(400);
        expect(raw.body.success).toBe(false);
        expect(raw.body.error).toBe("Bad Request");
      },
      scrapeTimeout,
    )