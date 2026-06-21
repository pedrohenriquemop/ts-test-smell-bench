test("should update light and dark css vars if present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }
        `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "oklch(0.72 0.11 178)",
          },
        },
        { tailwind: { cssVariables: true } },
        { tailwindVersion: "v4" }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              :root {
                --background: hsl(210 40% 98%);
                --foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(215 20.2% 65.1%);
              }

              .dark {
                --background: hsl(222.2 84% 4.9%);
                --foreground: hsl(60 9.1% 97.8%);
                --primary: oklch(0.72 0.11 178);
              }

              @theme inline {
                --color-background: var(--background);
                --color-foreground: var(--foreground);
                --color-primary: var(--primary);
      }
              "
    `)
  })