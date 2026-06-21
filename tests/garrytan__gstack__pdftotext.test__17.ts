test("GSTACK_PDFTOTEXT_BIN takes precedence over PDFTOTEXT_BIN", () => {
    const info = withEnv(
      { GSTACK_PDFTOTEXT_BIN: REAL_EXE, PDFTOTEXT_BIN: "/nonexistent/legacy" },
      () => resolvePdftotext(),
    );
    expect(info.bin).toBe(REAL_EXE);
  })