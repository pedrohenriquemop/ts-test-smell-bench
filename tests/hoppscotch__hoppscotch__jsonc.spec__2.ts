test("removes single multiline comment", () => {
      const input = '{\n  /* This is a comment */\n  "key": "value"\n}';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({ key: "value" });
    })