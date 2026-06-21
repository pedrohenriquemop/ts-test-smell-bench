it('new commands are in correct scope sets', () => {
    const { SCOPE_READ, SCOPE_WRITE } = require('../src/token-registry');
    expect(SCOPE_READ.has('media')).toBe(true);
    expect(SCOPE_READ.has('data')).toBe(true);
    expect(SCOPE_WRITE.has('download')).toBe(true);
    expect(SCOPE_WRITE.has('scrape')).toBe(true);
    expect(SCOPE_WRITE.has('archive')).toBe(true);
  })