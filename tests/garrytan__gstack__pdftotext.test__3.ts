test("normalizes CRLF and CR to LF (Windows Xpdf)", () => {
    expect(normalize("a\r\nb\rc")).toBe("a\nb\nc");
  })