it("should return false for short hash fragments even with slashes", () => {
      expect(crawler["noSections"]("https://example.com/page#/")).toBe(false);
    })