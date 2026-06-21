test("resolves wildcard imports that strip extensions", async () => {
    const result = await resolveImportWithMetadata(
      "#components-ext/button",
      config
    )

    expect(result).toEqual({
      path: path.resolve(cwd, "src/components/button.tsx"),
      source: "package_imports",
      matchedAlias: "#components-ext/*",
      matchedTarget: "./src/components/*.tsx",
      emitMode: "strip_extension",
    })
  })