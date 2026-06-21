test("replaces non-breaking space with regular space", () => {
    expect(normalize("hello\u00a0world")).toBe("hello world");
  })