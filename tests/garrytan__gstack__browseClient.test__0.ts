test("returns the bare path on POSIX when it's executable", () => {
    if (process.platform === "win32") return;
    const found = findExecutable("/bin/sh");
    expect(found).toBe("/bin/sh");
  })