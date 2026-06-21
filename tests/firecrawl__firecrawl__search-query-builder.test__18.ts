it("should return undefined for unknown URLs", () => {
      expect(
        getCategoryFromUrl("https://example.com", categoryMap),
      ).toBeUndefined();
      expect(
        getCategoryFromUrl("https://google.com", categoryMap),
      ).toBeUndefined();
    })