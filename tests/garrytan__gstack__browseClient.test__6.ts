test("GSTACK_BROWSE_BIN takes precedence over BROWSE_BIN", () => {
    const resolved = withEnv(
      { GSTACK_BROWSE_BIN: REAL_EXE, BROWSE_BIN: "/nonexistent/legacy" },
      () => resolveBrowseBin(),
    );
    expect(resolved).toBe(REAL_EXE);
  })