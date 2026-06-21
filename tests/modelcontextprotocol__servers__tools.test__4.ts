it('should reject missing message', () => {
      expect(() => EchoSchema.parse({})).toThrow();
    })