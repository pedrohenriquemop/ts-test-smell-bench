test("removes trailing comma in array", () => {
      const input = '["item1", "item2",]';
      const result = stripComments(input);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual(["item1", "item2"]);
    })