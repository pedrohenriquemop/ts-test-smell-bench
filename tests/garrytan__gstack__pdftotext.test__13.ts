test("on win32, probes .exe / .cmd / .bat after the bare-path miss", () => {
    if (process.platform !== "win32") return;
    const base = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd");
    expect(findExecutable(base)).toBe(base + ".exe");
  })