it('clear resets buffer', () => {
    const buf = new SizeCappedBuffer(1000);
    buf.push(makeEntry(100));
    buf.push(makeEntry(200));
    buf.clear();
    expect(buf.length).toBe(0);
    expect(buf.byteSize).toBe(0);
  })