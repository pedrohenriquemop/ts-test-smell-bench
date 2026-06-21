it('preserves Unix paths', () => {
      expect(normalizePath('/usr/local/bin'))
        .toBe('/usr/local/bin');
      expect(normalizePath('/home/user/some path'))
        .toBe('/home/user/some path');
      expect(normalizePath('"/usr/local/some app/"'))
        .toBe('/usr/local/some app');
      expect(normalizePath('/usr/local//bin/app///'))
        .toBe('/usr/local/bin/app');
      expect(normalizePath('/'))
        .toBe('/');
      expect(normalizePath('///'))
        .toBe('/');
    })