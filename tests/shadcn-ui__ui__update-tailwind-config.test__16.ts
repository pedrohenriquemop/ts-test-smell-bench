test("should handle objects nested in arrays", async () => {
    expect(
      await transformTailwindConfig(
        `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: [
          '0.875rem',
          {
            lineHeight: '1.25rem',
          },
        ],
      },
    },
  },
}
export default config
  `,
        {
          theme: {
            extend: {
              fontSize: {
                xl: [
                  'clamp(1.5rem, 1.04vi + 1.17rem, 2rem)',
                  {
                    lineHeight: '1.2',
                    letterSpacing: '-0.02em',
                    fontWeight: '600',
                  },
                ],
              }
            },
          },
        },
        {
          config: SHARED_CONFIG,
        }
      )
    ).toMatchSnapshot()
  })