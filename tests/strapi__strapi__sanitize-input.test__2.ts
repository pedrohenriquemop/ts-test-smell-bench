it('strips root key not in route body schema when strictParams: true', async () => {
      const route = {
        request: {
          body: {
            'application/json': z.object({
              title: z.string(),
              clientMutationId: z.string().optional(),
            }),
          },
        },
      };
      const input = { title: 'x', otherExtraKey: 'y' };

      const result = await sanitizers.input(input, articleModel, {
        strictParams: true,
        route,
      });

      expect(result).toHaveProperty('title', 'x');
      expect(result).not.toHaveProperty('otherExtraKey');
    })