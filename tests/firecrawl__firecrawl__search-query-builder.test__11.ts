it("should ignore invalid category objects", () => {
      const result = buildSearchQuery("test", [{ type: "invalid" as any }]);
      expect(result.query).toBe("test");
      expect(result.categoryMap.size).toBe(0);
    })