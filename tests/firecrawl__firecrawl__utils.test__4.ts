it("should handle edge cases", () => {
      expect(crawler["noSections"]("https://example.com/page#ab")).toBe(false);
      expect(crawler["noSections"]("https://example.com/page#abc/def")).toBe(
        true,
      );
    })