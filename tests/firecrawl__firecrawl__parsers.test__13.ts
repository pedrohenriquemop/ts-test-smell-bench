it.concurrent(
      "rejects non-array parsers",
      async () => {
        const raw = await scrapeRaw(
          {
            url: pdfUrl,
            parsers: "pdf" as any,
          },
          identity,
        );

        expect(raw.statusCode).toBe(400);
        expect(raw.body.success).toBe(false);
        expect(raw.body.error).toBe("Bad Request");
      },
      scrapeTimeout,
    )