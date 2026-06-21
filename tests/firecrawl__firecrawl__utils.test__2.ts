it("should return true for hash fragments that look like routes", () => {
      expect(crawler["noSections"]("https://example.com/app#/dashboard")).toBe(
        true,
      );
      expect(
        crawler["noSections"]("https://example.com/spa#/user/profile"),
      ).toBe(true);
      expect(
        crawler["noSections"]("https://example.com/page#/settings/account"),
      ).toBe(true);
    })