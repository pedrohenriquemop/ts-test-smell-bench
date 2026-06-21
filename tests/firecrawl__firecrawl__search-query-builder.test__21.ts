it("should work with subdomains", () => {
      expect(
        getCategoryFromUrl("https://api.github.com/user/repo", categoryMap),
      ).toBe("github");
      expect(
        getCategoryFromUrl(
          "https://export.arxiv.org/abs/2024.12345",
          categoryMap,
        ),
      ).toBe("research");
    })