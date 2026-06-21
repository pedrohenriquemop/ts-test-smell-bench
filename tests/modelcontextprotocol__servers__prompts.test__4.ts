it('should generate promotion message with department and name', () => {
      const { mockServer, handlers } = createMockServer();
      registerPromptWithCompletions(mockServer);

      const handler = handlers.get('completable-prompt')!;
      const result = handler({ department: 'Engineering', name: 'Alice' });

      expect(result.messages[0].content.text).toBe(
        'Please promote Alice to the head of the Engineering team.'
      );
    })