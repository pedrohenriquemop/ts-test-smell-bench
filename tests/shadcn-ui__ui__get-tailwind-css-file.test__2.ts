test("should return null when no css file found and no configCssFile", async () => {
    const cwd = path.resolve(
      __dirname,
      "../fixtures/frameworks/next-monorepo"
    )
    // The CSS file is nested under packages/ which the glob finds.
    // Without configCssFile, it should still find it via glob.
    expect(await getTailwindCssFile(cwd)).toBe(
      "packages/ui/src/globals.css"
    )
  })