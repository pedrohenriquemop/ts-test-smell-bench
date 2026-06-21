test("removes trailing comma in object", () => {
      const input = '{"key": "value",}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ key: "value" });
    })