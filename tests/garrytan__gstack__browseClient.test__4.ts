test("honors GSTACK_BROWSE_BIN when it points at a real executable", () => {
    const resolved = withEnv({ GSTACK_BROWSE_BIN: REAL_EXE }, () => resolveBrowseBin());
    expect(resolved).toBe(REAL_EXE);
  })