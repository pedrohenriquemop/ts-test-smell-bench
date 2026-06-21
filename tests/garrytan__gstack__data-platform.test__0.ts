it('stores entries within capacity', () => {
    const buf = new SizeCappedBuffer(1000);
    buf.push(makeEntry(100));
    buf.push(makeEntry(200));
    expect(buf.length).toBe(2);
    expect(buf.byteSize).toBe(300);
  })