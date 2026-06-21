test('rewrite export default', () => {
    expect(
      rewriteDefault(`export  default {}`, 'script')
    ).toMatchInlineSnapshot(`"const script = {}"`)
  })