it("should identify GitHub URLs", () => {
      expect(
        getCategoryFromUrl("https://github.com/user/repo", categoryMap),
      ).toBe("github");
      expect(
        getCategoryFromUrl("https://www.github.com/user/repo", categoryMap),
      ).toBe("github");
      expect(
        getCategoryFromUrl("http://github.com/user/repo", categoryMap),
      ).toBe("github");
    })