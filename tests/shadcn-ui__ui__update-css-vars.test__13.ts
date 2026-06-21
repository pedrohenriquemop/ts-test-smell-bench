test("should add --radius-* if radius present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            radius: "0.125rem",
          },
          dark: {
            radius: "0.5rem",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
          --radius: 0.125rem;
      }

      .dark {
          --radius: 0.5rem;
      }

      @theme inline {
          --radius-sm: calc(var(--radius) * 0.6);
          --radius-md: calc(var(--radius) * 0.8);
          --radius-lg: var(--radius);
          --radius-xl: calc(var(--radius) * 1.4);
          --radius-2xl: calc(var(--radius) * 1.8);
          --radius-3xl: calc(var(--radius) * 2.2);
          --radius-4xl: calc(var(--radius) * 2.6);
      }
              "
    `)
  })