test('@Component\nexport default class w/ comments 4', async () => {
    expect(
      rewriteDefault(
        `@Component
        export default class App extends Vue {
          /* default <- This word means my component is not built correctly */
          @Prop({ type: String, required: true })
          protected someString: string;
        }`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "@Component
              class App extends Vue {
                /* default <- This word means my component is not built correctly */
                @Prop({ type: String, required: true })
                protected someString: string;
              }
      const script = App"
    `)
  })