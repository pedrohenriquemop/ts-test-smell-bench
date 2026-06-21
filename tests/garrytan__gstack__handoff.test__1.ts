test('getFailureHint returns hint after 3 consecutive failures', () => {
    const tracker = new BrowserManager();
    tracker.incrementFailures();
    tracker.incrementFailures();
    tracker.incrementFailures();
    const hint = tracker.getFailureHint();
    expect(hint).not.toBeNull();
    expect(hint).toContain('handoff');
    expect(hint).toContain('3');
  })