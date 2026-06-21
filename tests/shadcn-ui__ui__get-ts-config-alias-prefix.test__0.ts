test("parses JSONC tsconfig files with trailing commas", async () => {
    const cwd = await fs.mkdtemp(path.join(tmpdir(), "shadcn-jsonc-tsconfig-"))

    try {
      await fs.writeFile(
        path.join(cwd, "tsconfig.json"),
        `{
          // This mirrors the JSONC shape emitted by common TS templates.
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["./src/*"], // trailing comments are valid JSONC.
            },
          },
        }
        `,
        "utf8"
      )

      expect(await getTsConfigAliasPrefix(cwd)).toBe("@")
    } finally {
      await fs.remove(cwd)
    }
  })