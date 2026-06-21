test("honors PDFTOTEXT_BIN as a back-compat alias", () => {
    const info = withEnv(
      { GSTACK_PDFTOTEXT_BIN: undefined, PDFTOTEXT_BIN: REAL_EXE },
      () => resolvePdftotext(),
    );
    expect(info.bin).toBe(REAL_EXE);
  })