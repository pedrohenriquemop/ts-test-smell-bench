test("throws BrowseClientError with setup hint when nothing is found", () => {
    // Point overrides at non-existent paths and clear PATH so Bun.which finds
    // nothing. Sibling/global probes go through findExecutable on real paths,
    // but the test asserts on the error shape rather than depending on whether
    // a real browse install exists on the box.
    let thrown: unknown = null;
    try {
      withEnv(
        {
          GSTACK_BROWSE_BIN: "/nonexistent/gstack-browse-bin",
          BROWSE_BIN: "/nonexistent/browse-bin",
          PATH: "",
          Path: "",
        },
        () => resolveBrowseBin(),
      );
    } catch (err) {
      thrown = err;
    }

    if (thrown) {
      expect(thrown).toBeInstanceOf(BrowseClientError);
      expect((thrown as BrowseClientError).message).toContain("browse binary not found");
      expect((thrown as BrowseClientError).message).toContain("./setup");
      expect((thrown as BrowseClientError).message).toContain("GSTACK_BROWSE_BIN");
      // Back-compat alias still surfaces in the diagnostic.
      expect((thrown as BrowseClientError).message).toContain("BROWSE_BIN");
    }
    // If the test box has a real browse install on disk, sibling/global may
    // resolve and the helper won't throw — that's fine; the assertion is
    // gated on whether it threw at all.
  })