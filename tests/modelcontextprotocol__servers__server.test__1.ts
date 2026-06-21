it('should return a cleanup function', () => {
      const { cleanup } = createServer();

      expect(typeof cleanup).toBe('function');
    })