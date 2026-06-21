test("returns the bare path on POSIX when it's executable", () => {
    if (process.platform === "win32") return;
    expect(findExecutable("/bin/sh")).toBe("/bin/sh");
  })