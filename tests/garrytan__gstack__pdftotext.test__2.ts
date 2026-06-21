test("converts form feeds to double newlines (page break boundary)", () => {
    expect(normalize("page1\fpage2")).toBe("page1\n\npage2");
  })