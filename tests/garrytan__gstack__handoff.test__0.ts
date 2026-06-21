test('getFailureHint returns null when below threshold', () => {
    const tracker = new BrowserManager();
    tracker.incrementFailures();
    tracker.incrementFailures();
    expect(tracker.getFailureHint()).toBeNull();
  })