it('sanitizes extra input param that is a nested object (non-scalar)', async () => {
      const route = {
        request: {
          body: {
            'application/json': z.object({
              title: z.string(),
              metadata: z
                .object({
                  source: z.string(),
                  version: z.number(),
                })
                .transform((m) => ({ ...m, source: m.source.trim() })),
            }),
          },
        },
      };
      const input = { title: 'x', metadata: { source: '  web  ', version: 1 } };

      const result = await sanitizers.input(input, articleModel, {
        strictParams: true,
        route,
      });

      expect(result).toHaveProperty('title', 'x');
      expect(result).toHaveProperty('metadata', { source: 'web', version: 1 });
    })