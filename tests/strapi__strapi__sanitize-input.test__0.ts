it('keeps extra input param from route when strictParams: true and Zod parses', async () => {
      const route = {
        request: {
          body: {
            'application/json': z.object({
              title: z.string(),
              clientMutationId: z.string().transform((s) => s.trim()),
            }),
          },
        },
      };
      const input = { title: 'x', clientMutationId: '  foo  ' };

      const result = await sanitizers.input(input, articleModel, {
        strictParams: true,
        route,
      });

      expect(result).toHaveProperty('title', 'x');
      expect(result).toHaveProperty('clientMutationId', 'foo');
    })