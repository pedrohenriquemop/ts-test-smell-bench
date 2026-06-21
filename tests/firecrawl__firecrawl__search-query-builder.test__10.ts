it("should ignore invalid category types", () => {
      const result = buildSearchQuery("test", ["invalid" as any]);
      expect(result.query).toBe("test");
      expect(result.categoryMap.size).toBe(0);
    })