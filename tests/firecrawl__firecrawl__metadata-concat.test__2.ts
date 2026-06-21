it("should successfully resolve valid favicon URLs", async () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="/favicon.ico">
          <title>Test Page</title>
        </head>
        <body></body>
      </html>
    `;

    const meta: any = {
      url: "https://example.com",
      id: "test-id",
      logger: {
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
      },
    };

    const metadata = await extractMetadata(meta, html);

    expect(metadata.favicon).toBe("https://example.com/favicon.ico");
  })