test('without export default', () => {
    expect(rewriteDefault(`export  a = {}`, 'script')).toMatchInlineSnapshot(`
      "export  a = {}
      const script = {}"
    `)
  })