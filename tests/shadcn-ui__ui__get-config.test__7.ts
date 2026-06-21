test("get workspace config shows an actionable error when a workspace package is missing imports", async () => {
  const fixtureRoot = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports"
  )
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "shadcn-workspace-config-")
  )

  try {
    await fs.copy(fixtureRoot, tempDir)

    const uiPackageJsonPath = path.resolve(tempDir, "packages/ui/package.json")
    const uiPackageJson = await fs.readJson(uiPackageJsonPath)
    delete uiPackageJson.imports
    await fs.writeJson(uiPackageJsonPath, uiPackageJson, { spaces: 2 })

    const config = await getConfig(path.resolve(tempDir, "apps/web"))
    if (!config) {
      throw new Error("Failed to load broken monorepo app config")
    }

    await expect(getWorkspaceConfig(config)).rejects.toThrowError(
      new RegExp(
        "Could not resolve the following aliases.*packages/ui.*components, ui, lib, hooks, utils",
        "s"
      )
    )
  } finally {
    await fs.remove(tempDir)
  }
})