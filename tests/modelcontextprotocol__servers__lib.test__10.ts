it('should return valid JSON in response', () => {
      const input = {
        thought: 'Test thought',
        thoughtNumber: 1,
        totalThoughts: 1,
        nextThoughtNeeded: false
      };

      const result = server.processThought(input);

      expect(() => JSON.parse(result.content[0].text)).not.toThrow();
    })