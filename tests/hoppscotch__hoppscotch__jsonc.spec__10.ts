test("returns whitespace-only string unchanged", () => {
      const input = "   \n  \t  ";
      const result = stripComments(input);
      expect(result).toBe(input);
    })