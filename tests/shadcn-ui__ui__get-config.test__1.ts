test("get project config from package imports", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/frameworks/next-app-imports")

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      baseColor: "zinc",
      css: "src/app/styles.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: path.resolve(cwd, "tailwind.config.ts"),
      tailwindCss: path.resolve(cwd, "src/app/styles.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils.ts"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})