it('evicts multiple entries for one large push', () => {
    const buf = new SizeCappedBuffer(500);
    buf.push(makeEntry(100));
    buf.push(makeEntry(100));
    buf.push(makeEntry(100));
    buf.push(makeEntry(400)); // evicts first two (need totalSize + 400 <= 500, so totalSize <= 100)
    expect(buf.length).toBe(2); // one 100-byte entry + one 400-byte entry
    expect(buf.byteSize).toBe(500);
  })