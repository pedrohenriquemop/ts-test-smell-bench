test("should handle var(--color-*) references as colors", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            background: "var(--color-background)",
            foreground: "var(--color-foreground)",
            primary: "var(--color-blue-500)",
            spacing: "var(--spacing-md)",
          },
          dark: {
            background: "var(--color-background-dark)",
            foreground: "var(--color-foreground-dark)",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
          --background: var(--color-background);
          --foreground: var(--color-foreground);
          --primary: var(--color-blue-500);
          --spacing: var(--spacing-md);
      }

      .dark {
          --background: var(--color-background-dark);
          --foreground: var(--color-foreground-dark);
      }

      @theme inline {
          --color-background: var(--background);
          --color-foreground: var(--foreground);
          --color-primary: var(--primary);
          --spacing: var(--spacing);
      }
              "
    `)
  })