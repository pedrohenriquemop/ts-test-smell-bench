test("strips trailing spaces", () => {
    expect(normalize("hello   \nworld")).toBe("hello\nworld");
  })