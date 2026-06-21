it("should handle GitHub category as object", () => {
      const result = buildSearchQuery("code review", [{ type: "github" }]);
      expect(result.query).toBe("code review (site:github.com)");
      expect(result.categoryMap.get("github.com")).toBe("github");
    })