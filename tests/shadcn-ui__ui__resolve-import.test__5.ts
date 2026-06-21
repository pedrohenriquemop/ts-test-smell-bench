test("resolves the root alias for wildcard package imports", async () => {
    expect(await resolveImport("#components", config)).toEqual(
      path.resolve(cwd, "src/components")
    )
  })