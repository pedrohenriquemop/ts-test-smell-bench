it("should return true for URLs without hash fragments", () => {
      expect(crawler["noSections"]("https://example.com/page")).toBe(true);
      expect(crawler["noSections"]("https://example.com/blog/post")).toBe(true);
      expect(crawler["noSections"]("https://example.com")).toBe(true);
    })