test("should not add the base layer if it is already present", async () => {
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

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
  `,
        {},
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
          --background: 210 40% 98%;
        }

        .dark{
          --background: 222.2 84% 4.9%;
        }
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