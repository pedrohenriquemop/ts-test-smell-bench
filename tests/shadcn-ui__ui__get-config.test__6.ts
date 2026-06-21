test("get workspace config resolves cross-package aliases without tsconfig paths", async () => {
  const appCwd = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports/apps/web"
  )
  const uiCwd = path.resolve(
    __dirname,
    "../fixtures/frameworks/vite-monorepo-imports/packages/ui"
  )

  const config = await getConfig(appCwd)
  if (!config) {
    throw new Error("Failed to load monorepo app config")
  }

  expect(await getWorkspaceConfig(config)).toMatchObject({
    components: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
    ui: {
      resolvedPaths: {
        cwd: uiCwd,
      },
    },
    lib: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
    hooks: {
      resolvedPaths: {
        cwd: appCwd,
      },
    },
  })
})