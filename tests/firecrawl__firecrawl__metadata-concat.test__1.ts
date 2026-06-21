it("should handle invalid favicon URLs gracefully", async () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="//#DOMAIN#/favicon.ico">
          <title>Test Page</title>
        </head>
        <body></body>
      </html>
    `;

    const mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    const meta: any = {
      url: "https://example.com",
      rewrittenUrl: "https://example.com",
      id: "test-id",
      logger: mockLogger,
    };

    const metadata = await extractMetadata(meta, html);

    expect(metadata.favicon).toBeUndefined();
    expect(mockLogger.debug).toHaveBeenCalledWith(
      "Failed to resolve favicon URL",
      expect.objectContaining({
        favicon: expect.stringContaining("#DOMAIN#"),
        error: expect.any(Error),
      }),
    );
  })