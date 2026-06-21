it('should validate positive integer IDs', () => {
      expect(resourceIdForResourceTemplateCompleter('1')).toEqual(['1']);
      expect(resourceIdForResourceTemplateCompleter('50')).toEqual(['50']);
    })