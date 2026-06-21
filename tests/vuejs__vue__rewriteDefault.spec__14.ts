test('@Component\nexport default class w/ comments 3', async () => {
    expect(
      rewriteDefault(
        `/*\n@Component\nexport default class Foo {}*/\n` +
          `export default class Bar {}`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "/*
      @Component
      export default class Foo {}*/
       class Bar {}
      const script = Bar"
    `)
  })