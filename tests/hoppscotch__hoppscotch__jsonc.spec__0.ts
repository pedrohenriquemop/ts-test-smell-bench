test("removes single inline comment", () => {
      const input = '{"key": "value" // comment\n}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ key: "value" });
    })