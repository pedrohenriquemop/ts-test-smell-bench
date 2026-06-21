it('should handle accept action with user content', async () => {
      const handlers: Map<string, Function> = new Map();
      const mockSendRequest = vi.fn().mockResolvedValue({
        action: 'accept',
        content: {
          name: 'John Doe',
          check: true,
          email: 'john@example.com',
        },
      });

      const mockServer = {
        registerTool: vi.fn((name: string, config: any, handler: Function) => {
          handlers.set(name, handler);
        }),
        server: {
          getClientCapabilities: vi.fn(() => ({ elicitation: {} })),
        },
      } as unknown as McpServer;

      registerTriggerElicitationRequestTool(mockServer);

      const handler = handlers.get('trigger-elicitation-request')!;
      const result = await handler({}, { sendRequest: mockSendRequest });

      expect(result.content[0].text).toContain('✅');
      expect(result.content[0].text).toContain('provided');
      expect(result.content[1].text).toContain('John Doe');
    })