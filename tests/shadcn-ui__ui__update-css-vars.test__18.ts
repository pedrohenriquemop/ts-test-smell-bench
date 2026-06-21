test("should preserve quotes", async () => {
    expect(
      await transformCssVars(
        `@import 'tailwindcss';
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            plugins: [
              'require("tailwindcss-animate")',
              'require("@tailwindcss/typography")',
            ],
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import 'tailwindcss';

      @plugin '@tailwindcss/typography';

      @plugin 'tailwindcss-animate';

      @custom-variant dark (&:is(.dark *));
              "
    `)
  })