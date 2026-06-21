test("handles deeply nested structures", () => {
      const input = '{\n  "a": {\n    "b": {\n      "c": {\n        "d": "value", // nested comment\n      },\n    },\n  },\n}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ a: { b: { c: { d: "value" } } } });
    })