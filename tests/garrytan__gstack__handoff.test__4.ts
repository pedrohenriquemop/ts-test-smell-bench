test('getIsHeaded returns false by default', () => {
    const tracker = new BrowserManager();
    expect(tracker.getIsHeaded()).toBe(false);
  })