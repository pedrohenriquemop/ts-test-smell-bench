test("get workspace config shows an actionable error when a workspace package is missing components.json", async () => {
  const fixtureRoot = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports"
  )
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "shadcn-workspace-config-")
  )

  try {
    await fs.copy(fixtureRoot, tempDir)
    await fs.remove(path.resolve(tempDir, "packages/ui/components.json"))

    const config = await getConfig(path.resolve(tempDir, "apps/web"))
    if (!config) {
      throw new Error("Failed to load broken monorepo app config")
    }

    await expect(getWorkspaceConfig(config)).rejects.toThrowError(
      new RegExp(
        "Could not load the workspace config.*packages/ui.*components.json.*path aliases or package imports",
        "s"
      )
    )
  } finally {
    await fs.remove(tempDir)
  }
})