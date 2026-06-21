it('returns the service registered under ai.admin', () => {
      const aiAdminService = {
        isEnabled: jest.fn().mockReturnValue(true),
        getAiToken: jest.fn(),
        getAiUsage: jest.fn(),
        getAiFeatureConfig: jest.fn(),
      };

      const ns = createAiNamespace(createMockStrapi(aiAdminService));
      expect(ns.admin).toBe(aiAdminService);
    })