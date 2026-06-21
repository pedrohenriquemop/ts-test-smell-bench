test("preserves JSON strings containing comment-like sequences", () => {
      const input = '{"url": "https://example.com//path"}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed.url).toBe("https://example.com//path");
    })