test('@Component\nexport default class w/ comments', async () => {
    expect(
      rewriteDefault(
        `// export default\n@Component\nexport default class Foo {}`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "// export default
      @Component
      class Foo {}
      const script = Foo"
    `)
  })