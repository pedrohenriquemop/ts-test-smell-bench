test("should NOT add --radius-* if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
      @custom-variant dark (&:is(.dark *));
      :root {
        --radius: 0.125rem;
      }
      @theme inline {
        --radius-sm: calc(var(--radius) - 4px);
        --radius-md: calc(var(--radius) - 2px);
        --radius-lg: var(--radius);
        --radius-xl: calc(var(--radius) + 4px);
      }
        `,
        {
          light: {
            radius: "0.125rem",
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
            @theme inline {
              --radius-sm: calc(var(--radius) - 4px);
              --radius-md: calc(var(--radius) - 2px);
              --radius-lg: var(--radius);
              --radius-xl: calc(var(--radius) + 4px);
              --radius-2xl: calc(var(--radius) * 1.8);
              --radius-3xl: calc(var(--radius) * 2.2);
              --radius-4xl: calc(var(--radius) * 2.6);
            }
              "
    `)
  })