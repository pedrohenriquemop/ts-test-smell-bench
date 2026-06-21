test("it should only add hsl() for rgb and hex values", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "rgb(255, 255, 255)",
            foreground: "hsl(240 10% 3.9%)",
          },
          dark: {
            background: "hsl(240 10% 3.9%)",
            foreground: "#000fff",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
          --background: rgb(255, 255, 255);
          --foreground: hsl(240 10% 3.9%);
      }

      .dark {
          --background: hsl(240 10% 3.9%);
          --foreground: #000fff;
      }

      @theme inline {
          --color-background: var(--background);
          --color-foreground: var(--foreground);
      }
              "
    `)
  })