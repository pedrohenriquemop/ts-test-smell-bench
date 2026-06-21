it("should return false for simple anchor links", () => {
      expect(crawler["noSections"]("https://example.com/page#section")).toBe(
        false,
      );
      expect(crawler["noSections"]("https://example.com/page#top")).toBe(false);
      expect(crawler["noSections"]("https://example.com/page#")).toBe(false);
      expect(crawler["noSections"]("https://example.com/page#a")).toBe(false);
    })