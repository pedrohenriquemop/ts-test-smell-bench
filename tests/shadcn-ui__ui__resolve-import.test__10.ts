test("resolves workspace package wildcard exports for file imports", async () => {
    const result = await resolveImportWithMetadata(
      "@workspace/ui/components/button",
      config
    )

    expect(result).toEqual({
      path: path.resolve(root, "packages/ui/src/components/button.tsx"),
      source: "workspace_package_exports",
      matchedAlias: "@workspace/ui/components/*",
      matchedTarget: "./src/components/*.tsx",
      emitMode: "strip_extension",
    })
  })