it('should reject non-string message', () => {
      expect(() => EchoSchema.parse({ message: 123 })).toThrow();
    })