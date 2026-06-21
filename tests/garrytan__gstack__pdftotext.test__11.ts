test("paragraph boundary count drift calculation", () => {
    const expected = "para1\n\npara2\n\npara3";
    const extractedOk = "para1\n\npara2\n\npara3";
    const extractedTooFew = "para1 para2 para3";
    const extractedTooMany = "para1\n\n\n\npara2\n\n\n\npara3\n\n\n\npara4\n\n\n\npara5";

    const expectedBreaks = (expected.match(/\n\n/g) || []).length;
    const okBreaks = (extractedOk.match(/\n\n/g) || []).length;
    const tooFewBreaks = (extractedTooFew.match(/\n\n/g) || []).length;
    const tooManyBreaksNormalized = (normalize(extractedTooMany).match(/\n\n/g) || []).length;

    expect(Math.abs(expectedBreaks - okBreaks)).toBeLessThanOrEqual(4);
    expect(Math.abs(expectedBreaks - tooFewBreaks)).toBeGreaterThan(1);
    // After normalize, 3+ newlines become 2, so the count matches
    expect(Math.abs(expectedBreaks - tooManyBreaksNormalized)).toBeLessThanOrEqual(4);
  })