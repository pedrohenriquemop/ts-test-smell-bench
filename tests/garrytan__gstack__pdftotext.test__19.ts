test("error message includes Windows install hint and GSTACK_PDFTOTEXT_BIN", () => {
    let thrown: unknown = null;
    try {
      withEnv(
        {
          GSTACK_PDFTOTEXT_BIN: "/nonexistent/gstack-pdftotext",
          PDFTOTEXT_BIN: "/nonexistent/pdftotext",
          PATH: "",
          Path: "",
        },
        () => resolvePdftotext(),
      );
    } catch (err) {
      thrown = err;
    }
    // If the test box has a real pdftotext on disk, resolution succeeds
    // (POSIX candidates) — that's fine; the assertion is gated on whether
    // it threw. On Windows-CI without poppler, it throws.
    if (thrown) {
      expect(thrown).toBeInstanceOf(PdftotextUnavailableError);
      expect((thrown as Error).message).toContain("pdftotext not found");
      expect((thrown as Error).message).toContain("GSTACK_PDFTOTEXT_BIN");
      expect((thrown as Error).message).toContain("Windows");
      expect((thrown as Error).message).toContain("scoop install poppler");
    }
  })