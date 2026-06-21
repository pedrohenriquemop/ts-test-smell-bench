test("identifies Error instances as infrastructure errors", () => {
    expect(isInfraError(new Error("test error"))).toBe(true)
  })