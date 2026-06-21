it('isCdpMethodAllowed returns true for the small read-only safe set', () => {
    expect(isCdpMethodAllowed('Accessibility.getFullAXTree')).toBe(true);
    expect(isCdpMethodAllowed('DOM.getBoxModel')).toBe(true);
    expect(isCdpMethodAllowed('Performance.getMetrics')).toBe(true);
    expect(isCdpMethodAllowed('Page.captureScreenshot')).toBe(true);
  })