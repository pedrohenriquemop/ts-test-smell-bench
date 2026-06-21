test("ignores package import targets outside the package", async () => {
    expect(resolvePackageImport("#outside/file", cwd)).toBeNull()
  })