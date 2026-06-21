it('summary shows entries', () => {
    const buf = new SizeCappedBuffer(1000);
    buf.push(makeEntry(1024, 'https://api.example.com/graphql'));
    const summary = buf.summary();
    expect(summary).toContain('1 responses');
    expect(summary).toContain('graphql');
    expect(summary).toContain('1KB');
  })