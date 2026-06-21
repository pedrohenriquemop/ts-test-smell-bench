it("should identify research URLs from category map", () => {
      expect(
        getCategoryFromUrl("https://arxiv.org/abs/2024.12345", categoryMap),
      ).toBe("research");
      expect(
        getCategoryFromUrl(
          "https://www.nature.com/articles/s12345",
          categoryMap,
        ),
      ).toBe("research");
      expect(
        getCategoryFromUrl(
          "https://ieeexplore.ieee.org/document/12345",
          categoryMap,
        ),
      ).toBe("research");
    })