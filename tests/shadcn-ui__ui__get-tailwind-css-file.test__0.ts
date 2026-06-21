test("should use configCssFile when provided and file exists", async () => {
    const cwd = path.resolve(
      __dirname,
      "../fixtures/frameworks/next-monorepo"
    )
    expect(
      await getTailwindCssFile(cwd, "packages/ui/src/globals.css")
    ).toBe("packages/ui/src/globals.css")
  })