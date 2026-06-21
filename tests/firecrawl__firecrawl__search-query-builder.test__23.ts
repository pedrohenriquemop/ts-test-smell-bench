it("should return array of default research sites", () => {
      const sites = getDefaultResearchSites();
      expect(Array.isArray(sites)).toBe(true);
      expect(sites.length).toBeGreaterThan(0);
      expect(sites).toContain("arxiv.org");
      expect(sites).toContain("nature.com");
      expect(sites).toContain("ieee.org");
      expect(sites).toContain("scholar.google.com");
    })