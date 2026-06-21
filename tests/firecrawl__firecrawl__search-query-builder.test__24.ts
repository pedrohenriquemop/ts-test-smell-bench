it("should return a new array each time (no mutation)", () => {
      const sites1 = getDefaultResearchSites();
      const sites2 = getDefaultResearchSites();
      expect(sites1).not.toBe(sites2); // Different array instances
      expect(sites1).toEqual(sites2); // But same content
    })