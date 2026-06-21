test("honors BROWSE_BIN as a back-compat alias", () => {
    const resolved = withEnv(
      { GSTACK_BROWSE_BIN: undefined, BROWSE_BIN: REAL_EXE },
      () => resolveBrowseBin(),
    );
    expect(resolved).toBe(REAL_EXE);
  })