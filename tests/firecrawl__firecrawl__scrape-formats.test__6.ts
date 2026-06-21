it.concurrent(
      "rejects invalid format type in object",
      async () => {
        const raw = await scrapeRaw(
          {
            url: base,
            formats: [{ type: "invalid-format" } as any],
          },
          identity,
        );

        expect(raw.statusCode).toBe(400);
        expect(raw.body.success).toBe(false);
      },
      scrapeTimeout,
    )