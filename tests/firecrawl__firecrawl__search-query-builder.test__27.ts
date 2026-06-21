it("should build correct query for multiple custom research sites", () => {
      const customSites = [
        "pubmed.ncbi.nlm.nih.gov",
        "biorxiv.org",
        "medrxiv.org",
      ];
      const result = buildSearchQuery("COVID-19 research", [
        { type: "research", sites: customSites },
      ]);

      expect(result.query).toBe(
        "COVID-19 research (site:pubmed.ncbi.nlm.nih.gov OR site:biorxiv.org OR site:medrxiv.org)",
      );

      // All sites should be mapped to research
      customSites.forEach(site => {
        expect(result.categoryMap.get(site)).toBe("research");
      });
    })