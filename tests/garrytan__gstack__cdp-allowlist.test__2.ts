it('lookupCdpMethod returns the entry for allowed methods', () => {
    const e = lookupCdpMethod('Accessibility.getFullAXTree');
    expect(e).not.toBeNull();
    expect(e!.scope).toBe('tab');
    expect(e!.output).toBe('untrusted');
  })