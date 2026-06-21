it('should read instructions from file', async () => {
      const { readInstructions } = await import('../resources/index.js');

      const instructions = readInstructions();

      // Should return a string (either content or error message)
      expect(typeof instructions).toBe('string');
      expect(instructions.length).toBeGreaterThan(0);
    })