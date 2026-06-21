test('export default class w/ comments', async () => {
    expect(
      rewriteDefault(`// export default\nexport default class Foo {}`, 'script')
    ).toMatchInlineSnapshot(`
      "// export default
      class Foo {}
      const script = Foo"
    `)
  })