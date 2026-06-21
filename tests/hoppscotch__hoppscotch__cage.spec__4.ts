test("handles non-object and null errors gracefully", () => {
    expect(isInfraError("string error")).toBe(false)
    expect(isInfraError(null)).toBe(false)
    expect(isInfraError(undefined)).toBe(false)
  })