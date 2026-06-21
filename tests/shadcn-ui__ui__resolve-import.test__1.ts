test("resolve import with base url", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/with-base-url")
  const config = (await loadConfig(cwd)) as ConfigLoaderSuccessResult

  expect(await resolveImport("@/components/ui", config)).toEqual(
    path.resolve(cwd, "components/ui")
  )
  expect(await resolveImport("@/lib/utils", config)).toEqual(
    path.resolve(cwd, "lib/utils")
  )
  expect(await resolveImport("foo/bar", config)).toEqual(
    path.resolve(cwd, "foo/bar")
  )
})