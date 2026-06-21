test("should update light and dark css vars if present", async () => {
    expect(
      await transformCssVars(
        `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base{
  :root{
    --background: 210 40% 98%;
  }

  .dark{
    --background: 222.2 84% 4.9%;
  }
}
  `,
        {
          light: {
            background: "215 20.2% 65.1%",
            foreground: "222.2 84% 4.9%",
          },
          dark: {
            foreground: "60 9.1% 97.8%",
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

      @layer base{
        :root{
          --background: 215 20.2% 65.1%;
          --foreground: 222.2 84% 4.9%;
        }

        .dark{
          --background: 222.2 84% 4.9%;
          --foreground: 60 9.1% 97.8%;
        }
      }
        "
    `)
  })