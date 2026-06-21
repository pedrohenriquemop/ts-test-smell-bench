it('untrusted-output methods cover the read-everything-attacker-controlled cases', () => {
    // Anything that reads attacker-controlled strings (DOM/AX/CSS selectors)
    // should be tagged untrusted so the envelope wraps the result.
    const untrustedMethods = CDP_ALLOWLIST.filter((e) => e.output === 'untrusted').map((e) => `${e.domain}.${e.method}`);
    expect(untrustedMethods).toContain('Accessibility.getFullAXTree');
    expect(untrustedMethods).toContain('CSS.getMatchedStylesForNode');
  })