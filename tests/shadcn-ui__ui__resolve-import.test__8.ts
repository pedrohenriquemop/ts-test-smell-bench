test("falls back to tsconfig paths when package imports do not match", async () => {
    expect(
      await resolveImportWithMetadata("#/components/ui", {
        absoluteBaseUrl: "/Users/shadcn/Projects/foobar",
        cwd,
        paths: {
          "#/*": ["./src/*"],
        },
      })
    ).toEqual({
      path: "/Users/shadcn/Projects/foobar/src/components/ui",
      source: "tsconfig_paths",
      matchedAlias: "#/*",
      matchedTarget: "./src/components/ui",
      emitMode: "strip_extension",
    })
  })