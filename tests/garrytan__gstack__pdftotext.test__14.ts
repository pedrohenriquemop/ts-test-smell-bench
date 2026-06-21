test("returns null when no extension matches", () => {
    expect(findExecutable("/nonexistent/path/to/nothing")).toBeNull();
  })