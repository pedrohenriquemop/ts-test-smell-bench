test("gracefully handles completely invalid JSON", () => {
      const input = 'this is not json at all {]}{]';
      const result = stripComments(input);
      // jsonc-parser extracts what it can and returns an object (even if mostly empty)
      expect(result).toBe('{}');
    })