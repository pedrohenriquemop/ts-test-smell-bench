test("removes multiple trailing commas in nested structures", () => {
      const input = '{"arr": ["a", "b",], "obj": {"key": "value",},}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ arr: ["a", "b"], obj: { key: "value" } });
    })