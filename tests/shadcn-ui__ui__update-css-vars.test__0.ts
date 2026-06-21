test("should add light and dark css vars if not present", async () => {
    expect(
      await transformCssVars(
        `@tailwind base;
@tailwind components;
@tailwind utilities;
  `,
        {
          light: {
            background: "white",
            foreground: "black",
          },
          dark: {
            background: "black",
            foreground: "white",
          },
        },
        {
          tailwind: {
            cssVariables: true,
          },
        }
      )
    ).toMatchInlineSnapshot(`
      "@tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --background: white;
          --foreground: black
        }
        .dark {
          --background: black;
          --foreground: white
        }
      }
        "
    `)
  })