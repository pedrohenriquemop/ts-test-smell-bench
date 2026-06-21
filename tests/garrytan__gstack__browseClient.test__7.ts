test("strips wrapping double quotes from override values", () => {
    const resolved = withEnv({ GSTACK_BROWSE_BIN: `"${REAL_EXE}"` }, () => resolveBrowseBin());
    expect(resolved).toBe(REAL_EXE);
  })