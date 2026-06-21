test('@Component\nexport default class', async () => {
    expect(rewriteDefault(`@Component\nexport default class Foo {}`, 'script'))
      .toMatchInlineSnapshot(`
      "@Component
      class Foo {}
      const script = Foo"
    `)
  })