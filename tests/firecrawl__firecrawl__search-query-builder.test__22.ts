it("should work with empty category map", () => {
      const emptyMap = new Map<string, string>();
      // GitHub is hardcoded, so it should still work
      expect(getCategoryFromUrl("https://github.com/user/repo", emptyMap)).toBe(
        "github",
      );
      // Others should return undefined
      expect(
        getCategoryFromUrl("https://arxiv.org/abs/2024.12345", emptyMap),
      ).toBeUndefined();
    })