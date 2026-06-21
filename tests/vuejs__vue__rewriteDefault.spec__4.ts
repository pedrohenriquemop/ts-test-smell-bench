test('export named default multiline', () => {
    expect(
      rewriteDefault(`let App = {}\n export {\nApp as default\n}`, '_sfc_main')
    ).toMatchInlineSnapshot(`
      "let App = {}
       export {
      
      }
      const _sfc_main = App"
    `)
  })