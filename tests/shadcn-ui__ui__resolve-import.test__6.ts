test("resolves exact imports and prefers local conditional targets", async () => {
    expect(await resolveImport("#hooks", config)).toEqual(
      path.resolve(cwd, "src/hooks/index.ts")
    )

    expect(await resolveImport("#dep", config)).toEqual(
      path.resolve(cwd, "dep-polyfill.js")
    )
  })