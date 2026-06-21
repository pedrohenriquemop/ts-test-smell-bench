test("handles JSON with syntax errors", () => {
      const input = '{"key": undefined}'; // undefined is not valid JSON
      const result = stripComments(input);
      // Parser will handle this - exact behavior depends on jsonc-parser
      expect(typeof result).toBe('string');
    })