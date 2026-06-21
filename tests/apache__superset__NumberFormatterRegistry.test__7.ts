test('removes leading and trailing spaces from format', () => {
      const formatter = registry.get(' .2f');
      expect(formatter).toBeInstanceOf(NumberFormatter);
      expect(formatter.format(100)).toEqual('100.00');
      const formatter2 = registry.get('.2f ');
      expect(formatter2).toBeInstanceOf(NumberFormatter);
      expect(formatter2.format(100)).toEqual('100.00');
      const formatter3 = registry.get(' .2f ');
      expect(formatter3).toBeInstanceOf(NumberFormatter);
      expect(formatter3.format(100)).toEqual('100.00');
    })