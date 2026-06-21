test("on win32, probes .exe / .cmd / .bat after the bare-path miss", () => {
    if (process.platform !== "win32") return;
    // cmd.exe lives at System32\cmd.exe — probe with the bare base.
    const base = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd");
    const found = findExecutable(base);
    expect(found).toBe(base + ".exe");
  })