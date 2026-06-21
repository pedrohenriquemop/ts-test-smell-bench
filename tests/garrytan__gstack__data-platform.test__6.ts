it('summary shows empty message when no entries', () => {
    const buf = new SizeCappedBuffer(1000);
    expect(buf.summary()).toBe('No captured responses.');
  })