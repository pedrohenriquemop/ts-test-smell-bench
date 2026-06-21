test("does not classify plain objects from QuickJS dump() as infrastructure", () => {
    // QuickJS dump() produces plain objects for user script errors — NOT Error instances
    expect(
      isInfraError({
        name: "ReferenceError",
        message: "a is not defined",
        stack: "    at <anonymous> (eval.js:1)\n",
      })
    ).toBe(false)

    expect(
      isInfraError({
        name: "TypeError",
        message: "cannot convert to object",
        stack: "    at keys (native)\n    at <anonymous> (eval.js:1)\n",
      })
    ).toBe(false)
  })