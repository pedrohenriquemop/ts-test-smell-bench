test("should NOT add @keyframes if already present", async () => {
    expect(
      await transformCssVars(
        `@import "tailwindcss";

        @theme inline {
          @keyframes accordion-down {
          from {
            height: 0;
          }
          to {
            height: var(--radix-accordion-content-height);
          }
        }
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
              },
            },
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@import "tailwindcss";

      @custom-variant dark (&:is(.dark *));

              @theme inline {
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