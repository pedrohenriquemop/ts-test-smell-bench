test("returns base for base styles", () => {
    expect(getBase("base-nova")).toBe("base")
    expect(getBase("base-vega")).toBe("base")
  })