test("does not treat workspace package exports as local alias imports", () => {
    expect(isLocalAliasImport("@workspace/ui/components/button", "#")).toBe(
      false
    )
  })