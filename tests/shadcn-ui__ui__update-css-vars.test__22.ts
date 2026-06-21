test("should NOT add --animate if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";
        @theme inline {
          --animate-accordion-up: accordion-up 0.3s ease-out;
        }
        `,
        {},
        { tailwind: { cssVariables: true } },
        {
          tailwindVersion: "v4",
          tailwindConfig: {
            theme: {
              extend: {
                keyframes: {
                  "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                  },
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                },
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));
              @theme inline {
                --animate-accordion-up: accordion-up 0.3s ease-out;
        --animate-accordion-down: accordion-down 0.2s ease-out;

        @keyframes accordion-down {
          from {
            height: 0;
                          }
          to {
            height: var(--radix-accordion-content-height);
                          }
                }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
                          }
          to {
            height: 0;
                          }
                }
              }
              "
    `)
  })