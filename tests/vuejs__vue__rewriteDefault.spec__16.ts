test('@Component\nexport default class w/ comments 5', async () => {
    expect(
      rewriteDefault(
        `@Component({})
        export default class HelloWorld extends Vue {
          test = "";
          mounted() {
            console.log("mounted!");
            this.test = "Hallo Welt!";
          }
          exportieren(): void {
            // do nothing
          }
          defaultWert(): void {
            // do nothing
          }
        }`,
        'script',
        ['typescript', 'decorators-legacy']
      )
    ).toMatchInlineSnapshot(`
      "@Component({}) class HelloWorld extends Vue {
                test = "";
                mounted() {
                  console.log("mounted!");
                  this.test = "Hallo Welt!";
                }
                exportieren(): void {
                  // do nothing
                }
                defaultWert(): void {
                  // do nothing
                }
              }
      const script = HelloWorld"
    `)
  })