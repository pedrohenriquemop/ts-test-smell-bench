it('normalizes bare Windows drive letters to the drive root on Windows', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true
      });

      expect(normalizePath('C:')).toBe('C:\\');
      expect(normalizePath('d:')).toBe('D:\\');
    })