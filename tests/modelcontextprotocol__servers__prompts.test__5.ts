it('should work with different departments', () => {
      const { mockServer, handlers } = createMockServer();
      registerPromptWithCompletions(mockServer);

      const handler = handlers.get('completable-prompt')!;

      const salesResult = handler({ department: 'Sales', name: 'David' });
      expect(salesResult.messages[0].content.text).toContain('Sales');
      expect(salesResult.messages[0].content.text).toContain('David');
      expect(salesResult.messages[0].role).toBe('user');

      const marketingResult = handler({ department: 'Marketing', name: 'Grace' });
      expect(marketingResult.messages[0].content.text).toContain('Marketing');
      expect(marketingResult.messages[0].content.text).toContain('Grace');
    })