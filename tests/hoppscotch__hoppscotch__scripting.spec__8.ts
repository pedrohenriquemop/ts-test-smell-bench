test("preserves script order (request → child → parent → root) for test scripts", () => {
      const requestScript = 'pw.test("request test", () => {});';
      const childScript = 'pw.test("child test", () => {});';
      const rootScript = 'pw.test("root test", () => {});';

      // Simulates the reversal pattern used in test runner:
      // combineScriptsWithIIFE([requestScript, ...inheritedTestScripts.slice().reverse()])
      const inheritedTestScripts = [rootScript, childScript];
      const result = combineScriptsWithIIFE([
        requestScript,
        ...inheritedTestScripts.slice().reverse(),
      ]);

      const requestIndex = result.indexOf(requestScript);
      const childIndex = result.indexOf(childScript);
      const rootIndex = result.indexOf(rootScript);

      expect(requestIndex).toBeLessThan(childIndex);
      expect(childIndex).toBeLessThan(rootIndex);
    })