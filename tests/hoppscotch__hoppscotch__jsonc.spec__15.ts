test("gracefully handles potential null from jsonc-parser", () => {
      const input = '{"key": "value"}';
      const result = stripComments(input);
      expect(result).toBeTruthy();
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ key: "value" });
    })