it('should reject invalid IDs', () => {
      expect(resourceIdForResourceTemplateCompleter('0')).toEqual([]);
      expect(resourceIdForResourceTemplateCompleter('-5')).toEqual([]);
      expect(resourceIdForResourceTemplateCompleter('not-a-number')).toEqual([]);
    })