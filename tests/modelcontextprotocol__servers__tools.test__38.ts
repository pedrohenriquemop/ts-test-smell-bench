it('should send sampling request and return result', async () => {
      const handlers: Map<string, Function> = new Map();
      const mockSendRequest = vi.fn().mockResolvedValue({
        model: 'test-model',
        content: { type: 'text', text: 'LLM response' },
      });

      const mockServer = {
        registerTool: vi.fn((name: string, config: any, handler: Function) => {
          handlers.set(name, handler);
        }),
        server: {
          getClientCapabilities: vi.fn(() => ({ sampling: {} })),
        },
      } as unknown as McpServer;

      registerTriggerSamplingRequestTool(mockServer);

      const handler = handlers.get('trigger-sampling-request')!;
      const result = await handler(
        { prompt: 'Test prompt', maxTokens: 50 },
        { sendRequest: mockSendRequest }
      );

      expect(mockSendRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'sampling/createMessage',
          params: expect.objectContaining({
            maxTokens: 50,
          }),
        }),
        expect.anything()
      );
      expect(result.content[0].text).toContain('LLM sampling result');
    })