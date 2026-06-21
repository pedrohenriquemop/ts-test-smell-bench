it('evicts oldest entries when over capacity', () => {
    const buf = new SizeCappedBuffer(500);
    buf.push(makeEntry(200, 'https://a.com'));
    buf.push(makeEntry(200, 'https://b.com'));
    buf.push(makeEntry(200, 'https://c.com')); // should evict first entry
    expect(buf.length).toBe(2);
    const urls = buf.toArray().map(e => e.url);
    expect(urls).toContain('https://b.com');
    expect(urls).toContain('https://c.com');
    expect(urls).not.toContain('https://a.com');
  })