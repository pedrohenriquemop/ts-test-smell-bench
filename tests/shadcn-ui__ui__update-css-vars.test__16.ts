test("should add plugin if not present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: { plugins: ['require("tailwindcss-animate")'] },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @plugin "tailwindcss-animate";

      @custom-variant dark (&:is(.dark *));
              "
    `)
  })