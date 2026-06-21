test("strips zero-width characters", () => {
    expect(normalize("a\u200bb\u200cc")).toBe("abc");
  })