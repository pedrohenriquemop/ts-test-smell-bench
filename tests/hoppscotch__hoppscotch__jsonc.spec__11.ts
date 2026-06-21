test("handles valid JSON without comments", () => {
      const input = '{"key": "value"}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ key: "value" });
    })