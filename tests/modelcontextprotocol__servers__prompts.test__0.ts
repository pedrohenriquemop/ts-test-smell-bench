it('should return fixed message with no arguments', () => {
      const { mockServer, handlers } = createMockServer();
      registerSimplePrompt(mockServer);

      const handler = handlers.get('simple-prompt')!;
      const result = handler();

      expect(result).toEqual({
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: 'This is a simple prompt without arguments.',
            },
          },
        ],
      });
    })