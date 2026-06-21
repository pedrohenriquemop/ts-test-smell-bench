test('export default class w/ comments 3', async () => {
    expect(
      rewriteDefault(
        `/*\nexport default class Foo {}*/\n` + `export default class Bar {}`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "/*
      export default class Foo {}*/
       class Bar {}
      const script = Bar"
    `)
  })