test("returns null when no extension matches", () => {
    const found = findExecutable("/nonexistent/path/to/nothing");
    expect(found).toBeNull();
  })