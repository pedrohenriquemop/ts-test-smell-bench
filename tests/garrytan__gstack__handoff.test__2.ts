test('hint suppressed when already headed', () => {
    const tracker = new BrowserManager();
    (tracker as any).isHeaded = true;
    tracker.incrementFailures();
    tracker.incrementFailures();
    tracker.incrementFailures();
    expect(tracker.getFailureHint()).toBeNull();
  })