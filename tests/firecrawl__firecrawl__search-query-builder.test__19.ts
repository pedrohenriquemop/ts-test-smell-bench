it("should handle invalid URLs gracefully", () => {
      expect(getCategoryFromUrl("not-a-url", categoryMap)).toBeUndefined();
      expect(getCategoryFromUrl("", categoryMap)).toBeUndefined();
      expect(
        getCategoryFromUrl("ftp://example.com", categoryMap),
      ).toBeUndefined();
    })