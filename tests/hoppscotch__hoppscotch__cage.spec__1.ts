test("identifies Error subclasses as infrastructure errors", () => {
    class QuickJSUnwrapError extends Error {
      constructor(message: string) {
        super(message)
        this.name = "QuickJSUnwrapError"
      }
    }

    expect(
      isInfraError(new QuickJSUnwrapError("cannot convert to object"))
    ).toBe(true)
  })