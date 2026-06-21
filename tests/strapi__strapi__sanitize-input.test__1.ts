it('removes extra input param when Zod safeParse fails', async () => {
      const route = {
        request: {
          body: {
            'application/json': z.object({
              title: z.string(),
              clientMutationId: z.string().min(1),
            }),
          },
        },
      };
      const input = { title: 'x', clientMutationId: '' };

      const result = await sanitizers.input(input, articleModel, {
        strictParams: true,
        route,
      });

      expect(result).toHaveProperty('title', 'x');
      expect(result).not.toHaveProperty('clientMutationId');
    })