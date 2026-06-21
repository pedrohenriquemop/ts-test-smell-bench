it('should include city and state in message', () => {
      const { mockServer, handlers } = createMockServer();
      registerArgumentsPrompt(mockServer);

      const handler = handlers.get('args-prompt')!;
      const result = handler({ city: 'San Francisco', state: 'California' });

      expect(result.messages[0].content.text).toBe(
        "What's weather in San Francisco, California?"
      );
    })