test("preserves script order (root → parent → child → request) for pre-request scripts", () => {
      const rootScript = 'pw.env.set("token", "root");';
      const parentScript = 'pw.env.set("parent", "true");';
      const requestScript = 'pw.env.set("request", "true");';

      const result = combineScriptsWithIIFE([
        rootScript,
        parentScript,
        requestScript,
      ]);

      const rootIndex = result.indexOf(rootScript);
      const parentIndex = result.indexOf(parentScript);
      const requestIndex = result.indexOf(requestScript);

      expect(rootIndex).toBeLessThan(parentIndex);
      expect(parentIndex).toBeLessThan(requestIndex);
    })