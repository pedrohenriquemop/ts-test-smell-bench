test(`export { default } from '...'`, async () => {
    expect(
      rewriteDefault(`export { default, foo } from './index.js'`, 'script')
    ).toMatchInlineSnapshot(`
    "import { default as __VUE_DEFAULT__ } from './index.js'
    export {  foo } from './index.js'
    const script = __VUE_DEFAULT__"
    `)

    expect(
      rewriteDefault(`export { default    , foo } from './index.js'`, 'script')
    ).toMatchInlineSnapshot(`
    "import { default as __VUE_DEFAULT__ } from './index.js'
    export {  foo } from './index.js'
    const script = __VUE_DEFAULT__"
    `)

    expect(
      rewriteDefault(`export { foo,   default } from './index.js'`, 'script')
    ).toMatchInlineSnapshot(`
    "import { default as __VUE_DEFAULT__ } from './index.js'
    export { foo,    } from './index.js'
    const script = __VUE_DEFAULT__"
    `)

    expect(
      rewriteDefault(
        `export { foo as default, bar } from './index.js'`,
        'script'
      )
    ).toMatchInlineSnapshot(`
    "import { foo } from './index.js'
    export {  bar } from './index.js'
    const script = foo"
    `)

    expect(
      rewriteDefault(
        `export { foo as default     , bar } from './index.js'`,
        'script'
      )
    ).toMatchInlineSnapshot(`
    "import { foo } from './index.js'
    export {  bar } from './index.js'
    const script = foo"
    `)

    expect(
      rewriteDefault(
        `export { bar,   foo as default } from './index.js'`,
        'script'
      )
    ).toMatchInlineSnapshot(`
    "import { foo } from './index.js'
    export { bar,    } from './index.js'
    const script = foo"
    `)
  })