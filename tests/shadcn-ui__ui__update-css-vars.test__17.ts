test("should NOT add plugin if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        @plugin "tailwindcss-animate";
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
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              @plugin "tailwindcss-animate";

              @plugin "@tailwindcss/typography";
              "
    `)
  })