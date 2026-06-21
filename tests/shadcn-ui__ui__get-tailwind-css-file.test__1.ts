test("should fall back to glob when configCssFile does not exist", async () => {
    const cwd = path.resolve(__dirname, "../fixtures/frameworks/next-app")
    expect(
      await getTailwindCssFile(cwd, "nonexistent/styles.css")
    ).toBe("app/globals.css")
  })