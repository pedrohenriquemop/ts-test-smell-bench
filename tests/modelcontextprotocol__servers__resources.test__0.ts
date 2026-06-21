it('should include both types in RESOURCE_TYPES array', () => {
      expect(RESOURCE_TYPES).toContain(RESOURCE_TYPE_TEXT);
      expect(RESOURCE_TYPES).toContain(RESOURCE_TYPE_BLOB);
      expect(RESOURCE_TYPES).toHaveLength(2);
    })