test("attempts to parse malformed JSON and returns result", () => {
      // jsonc-parser is lenient and tries to repair malformed JSON
      const input = '{"key": "value"'; // missing closing brace
      const result = stripComments(input);
      // The parser will attempt to close the brace
      expect(result).toBe('{"key":"value"}');
    })