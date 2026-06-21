test('@Component\nexport default class w/ comments 2', async () => {
    expect(
      rewriteDefault(
        `export default {}\n` + `// @Component\n// export default class Foo {}`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "const script = {}
      // @Component
      // export default class Foo {}"
    `)
  })