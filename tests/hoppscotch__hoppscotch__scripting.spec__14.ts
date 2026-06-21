test("default target is experimental (wrapped in try/catch)", () => {
      const result = combineScriptsWithIIFE(["const x = 1;"]);
      expect(result).toMatch(
        /^const __hoppReporter = globalThis\.__hoppReportScriptExecutionError;\s*try \{/
      );
      expect(result).toContain("await (async function() {");
    })