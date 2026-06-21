it("should return base query when no categories provided", () => {
      const result = buildSearchQuery("machine learning");
      expect(result.query).toBe("machine learning");
      expect(result.categoryMap.size).toBe(0);
    })