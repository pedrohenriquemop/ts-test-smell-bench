it('should validate correct input', () => {
      const result = EchoSchema.parse({ message: 'test' });
      expect(result).toEqual({ message: 'test' });
    })