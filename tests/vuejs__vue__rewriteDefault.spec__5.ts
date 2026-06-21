test('export named default multiline /w comments', () => {
    expect(
      rewriteDefault(
        `const a = 1 \n export {\n a as b,\n a as default,\n a as c}\n` +
          `// export { myFunction as default }`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "const a = 1 
       export {
       a as b,
       
       a as c}
      // export { myFunction as default }
      const script = a"
    `)

    expect(
      rewriteDefault(
        `const a = 1 \n export {\n a as b,\n a as default      ,\n a as c}\n` +
          `// export { myFunction as default }`,
        'script'
      )
    ).toMatchInlineSnapshot(`
      "const a = 1 
       export {
       a as b,
       
       a as c}
      // export { myFunction as default }
      const script = a"
    `)
  })