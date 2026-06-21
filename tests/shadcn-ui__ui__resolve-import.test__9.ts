test("resolves @/ via tsconfig paths and #/ via package imports in a mixed project", async () => {
    const tsconfigPath = await resolveImportWithMetadata(
      "@/components/button",
      {
        absoluteBaseUrl: cwd,
        cwd,
        paths: {
          "@/*": ["./src/*"],
        },
      }
    )
    expect(tsconfigPath?.source).toBe("tsconfig_paths")
    expect(tsconfigPath?.path).toBe(path.resolve(cwd, "src/components/button"))

    const packageImportPath = await resolveImportWithMetadata(
      "#components/button.tsx",
      {
        absoluteBaseUrl: cwd,
        cwd,
        paths: {
          "@/*": ["./src/*"],
        },
      }
    )
    expect(packageImportPath?.source).toBe("package_imports")
    expect(packageImportPath?.path).toBe(
      path.resolve(cwd, "src/components/button.tsx")
    )
  })