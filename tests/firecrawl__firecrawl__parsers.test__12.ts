it.concurrent(
      "rejects invalid parser types",
      async () => {
        const raw = await scrapeRaw(
          {
            url: pdfUrl,
            parsers: ["invalid-parser" as any],
          },
          identity,
        );

        expect(raw.statusCode).toBe(400);
        expect(raw.body.success).toBe(false);
        expect(raw.body.error).toBe("Bad Request");
      },
      scrapeTimeout,
    )