test("it should only add hsl() if not already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "0 0% 100%",
            foreground: "hsl(240 10% 3.9%)",
          },
          dark: {
            background: "hsl(240 10% 3.9%)",
            foreground: "0 0% 98%",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
          --background: hsl(0 0% 100%);
          --foreground: hsl(240 10% 3.9%);
      }

      .dark {
          --background: hsl(240 10% 3.9%);
          --foreground: hsl(0 0% 98%);
      }

      @theme inline {
          --color-background: var(--background);
          --color-foreground: var(--foreground);
      }
              "
    `)
  })