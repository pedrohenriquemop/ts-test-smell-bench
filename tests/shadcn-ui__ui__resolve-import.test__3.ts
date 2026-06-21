test("resolves wildcard imports that preserve extensions", async () => {
    const result = await resolveImportWithMetadata(
      "#components/button.tsx",
      config
    )

    expect(result).toEqual({
      path: path.resolve(cwd, "src/components/button.tsx"),
      source: "package_imports",
      matchedAlias: "#components/*",
      matchedTarget: "./src/components/*",
      emitMode: "preserve_extension",
    })
  })