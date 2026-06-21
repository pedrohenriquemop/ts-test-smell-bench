test("trims leading/trailing whitespace on whole string", () => {
    expect(normalize("\n\n  hello  \n\n")).toBe("hello");
  })