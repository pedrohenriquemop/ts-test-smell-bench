test("returns empty string unchanged", () => {
      const input = "";
      const result = stripComments(input);
      expect(result).toBe("");
    })