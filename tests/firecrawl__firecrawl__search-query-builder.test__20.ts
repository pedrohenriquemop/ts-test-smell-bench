it("should be case-insensitive", () => {
      expect(
        getCategoryFromUrl("https://GitHub.com/user/repo", categoryMap),
      ).toBe("github");
      expect(
        getCategoryFromUrl("https://ArXiv.org/abs/2024.12345", categoryMap),
      ).toBe("research");
    })