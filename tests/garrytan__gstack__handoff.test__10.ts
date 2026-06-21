test('resume clears refs and resets failures', () => {
    bm.incrementFailures();
    bm.incrementFailures();
    bm.incrementFailures();
    bm.resume();
    expect(bm.getFailureHint()).toBeNull();
    expect(bm.getRefCount()).toBe(0);
  })