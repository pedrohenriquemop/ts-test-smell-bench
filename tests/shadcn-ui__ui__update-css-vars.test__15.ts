test("should use --sidebar for --sidebar-background", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        `,
        {
          light: {
            "sidebar-background": "hsl(0 0% 98%)",
          },
          dark: {
            "sidebar-background": "hsl(0 0% 10%)",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

      :root {
          --sidebar: hsl(0 0% 98%);
      }

      .dark {
          --sidebar: hsl(0 0% 10%);
      }

      @theme inline {
          --color-sidebar: var(--sidebar);
      }
              "
    `)
  })