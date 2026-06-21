it('should handle city only (optional state omitted)', () => {
      const { mockServer, handlers } = createMockServer();
      registerArgumentsPrompt(mockServer);

      const handler = handlers.get('args-prompt')!;
      const result = handler({ city: 'New York' });

      expect(result.messages[0].content.text).toBe("What's weather in New York?");
      expect(result.messages[0].content.text).not.toContain(',');
      expect(result.messages[0].role).toBe('user');
      expect(result.messages[0].content.type).toBe('text');
    })