test("returns radix for radix styles", () => {
    expect(getBase("radix-nova")).toBe("radix")
    expect(getBase("radix-vega")).toBe("radix")
  })