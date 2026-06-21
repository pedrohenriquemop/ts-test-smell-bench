it('should handle very long thought strings', () => {
      const input = {
        thought: 'a'.repeat(10000),
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false
      };

      const result = server.processThought(input);
      expect(result.isError).toBeUndefined();
    })