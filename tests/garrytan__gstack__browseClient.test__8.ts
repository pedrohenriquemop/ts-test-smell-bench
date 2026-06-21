test("captures exit code, command, and stderr", () => {
    const err = new BrowseClientError(127, "pdf", "Chromium not found");
    expect(err.exitCode).toBe(127);
    expect(err.command).toBe("pdf");
    expect(err.stderr).toBe("Chromium not found");
    expect(err.message).toContain("browse pdf exited 127");
    expect(err.message).toContain("Chromium not found");
    expect(err.name).toBe("BrowseClientError");
  })