test("identifies WASM initialization errors", () => {
    expect(isInfraError(new Error("wasm init failed"))).toBe(true)
  })