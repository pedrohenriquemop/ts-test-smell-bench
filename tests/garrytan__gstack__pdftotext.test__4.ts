test("removes soft hyphens (hyphens: auto artifact)", () => {
    expect(normalize("extra\u00adordinary")).toBe("extraordinary");
  })