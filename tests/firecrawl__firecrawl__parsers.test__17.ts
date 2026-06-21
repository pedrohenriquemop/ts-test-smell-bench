it.concurrent(
      "rejects invalid mode in object format",
      async () => {
        const raw = await scrapeRaw(
          {
            url: pdfUrl,
            parsers: [{ type: "pdf", mode: "invalid" } as any],
          },
          identity,
        );

        expect(raw.statusCode).toBe(400);
        expect(raw.body.success).toBe(false);
        expect(raw.body.error).toBe("Bad Request");
      },
      scrapeTimeout,
    )