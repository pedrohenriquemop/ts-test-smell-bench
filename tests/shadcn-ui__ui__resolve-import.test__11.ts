test("resolves bare alias roots from workspace package wildcard exports", async () => {
    expect(await resolveImport("@workspace/ui/components", config)).toEqual(
      path.resolve(root, "packages/ui/src/components")
    )

    expect(await resolveImport("@workspace/ui/lib/utils", config)).toEqual(
      path.resolve(root, "packages/ui/src/lib/utils.ts")
    )
  })