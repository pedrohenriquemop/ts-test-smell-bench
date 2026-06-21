it('leaves other paths unchanged', () => {
      expect(expandHome('C:/test')).toBe('C:/test');
    })