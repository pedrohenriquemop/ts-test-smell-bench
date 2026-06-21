test("collapses runs of 3+ blank lines to 2", () => {
    expect(normalize("a\n\n\n\nb")).toBe("a\n\nb");
  })