test("honors GSTACK_PDFTOTEXT_BIN when it points at a real executable", () => {
    // We can't fake a real pdftotext, but we can fake "any executable" to
    // exercise the override-resolution path. describeBinary will mark flavor
    // as "unknown" since cmd.exe / /bin/sh don't respond to -v like pdftotext;
    // the test asserts on the bin-path resolution, not the version probe.
    const info = withEnv({ GSTACK_PDFTOTEXT_BIN: REAL_EXE }, () => resolvePdftotext());
    expect(info.bin).toBe(REAL_EXE);
  })