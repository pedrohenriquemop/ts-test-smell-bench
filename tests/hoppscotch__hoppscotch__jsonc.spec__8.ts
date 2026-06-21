test("handles nested objects with comments and trailing commas", () => {
      const input = '{\n  "outer": { // comment\n    "inner": "value",\n  },\n}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ outer: { inner: "value" } });
    })