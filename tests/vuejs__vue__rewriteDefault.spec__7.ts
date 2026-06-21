test('export default class', async () => {
    expect(rewriteDefault(`export default class Foo {}`, 'script'))
      .toMatchInlineSnapshot(`
      "class Foo {}
      const script = Foo"
    `)
  })