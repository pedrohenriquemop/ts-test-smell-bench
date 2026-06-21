test("strips wrapping double quotes from override values", () => {
    const info = withEnv({ GSTACK_PDFTOTEXT_BIN: `"${REAL_EXE}"` }, () => resolvePdftotext());
    expect(info.bin).toBe(REAL_EXE);
  })