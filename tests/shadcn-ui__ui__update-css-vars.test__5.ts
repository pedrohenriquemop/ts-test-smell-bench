test("should update theme vars if present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        :root {
          --background: hsl(210 40% 98%);
        }

        .dark {
          --background: hsl(222.2 84% 4.9%);
        }

        @theme inline {
          --color-background: var(--background);
        }
        `,
        {
          theme: {
            "font-poppins": "Poppins, sans-serif",
            "breakpoint-3xl": "120rem",
            "shadow-2xs": "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
            "animate-bounce": "bounce 1s infinite",
          },
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
            primary: "215 20.2% 65.1%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
            primary: "222.2 84% 4.9%",
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
                --primary: hsl(222.2 84% 4.9%);
              }

              @theme inline {
                --color-background: var(--background);
                --font-poppins: Poppins, sans-serif;
                --breakpoint-3xl: 120rem;
                --shadow-2xs: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
                --animate-bounce: bounce 1s infinite;
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }
              "
    `)
  })