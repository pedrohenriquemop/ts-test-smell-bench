test("get project config from root package imports", async () => {
  const cwd = path.resolve(__dirname, "../fixtures/frameworks/vite-root-imports")

  expect(await getProjectConfig(cwd)).toEqual({
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: "",
      baseColor: "zinc",
      css: "src/index.css",
      cssVariables: true,
      prefix: "",
    },
    iconLibrary: "lucide",
    aliases: {
      components: "#components",
      ui: "#components/ui",
      lib: "#lib",
      hooks: "#hooks",
      utils: "#lib/utils",
    },
    resolvedPaths: {
      cwd,
      tailwindConfig: "",
      tailwindCss: path.resolve(cwd, "src/index.css"),
      components: path.resolve(cwd, "src/components"),
      ui: path.resolve(cwd, "src/components/ui"),
      lib: path.resolve(cwd, "src/lib"),
      hooks: path.resolve(cwd, "src/hooks"),
      utils: path.resolve(cwd, "src/lib/utils"),
    },
    registries: {
      "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json",
    },
  })
})