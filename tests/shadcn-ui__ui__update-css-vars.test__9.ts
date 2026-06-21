test("should not add base layer if it is already present", async () => {
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

        @layer base {
          * {
            @apply border-border;
          }
          body {
            @apply bg-background text-foreground;
          }
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
                --color-primary: var(--primary);
                --color-foreground: var(--foreground);
              }

              @layer base {
                * {
                  @apply border-border;
                }
                body {
                  @apply bg-background text-foreground;
                }
              }
              "
    `)
  })