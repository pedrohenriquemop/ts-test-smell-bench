test("experimental target generates sequential await chain wrapped in try/catch", () => {
      const result = combineScriptsWithIIFE(
        ["const a = 1;", "const b = 2;", "const c = 3;"],
        "experimental"
      );

      // Outer wrapper captures the reporter lexically so user code that
      // deletes the globalThis property cannot suppress error reporting.
      expect(result).toMatch(
        /^const __hoppReporter = globalThis\.__hoppReportScriptExecutionError;\s*try \{/
      );
      expect(result).toContain("await (async function() {");
      // Each script contributes one `await` in the body.
      const awaitCount = (result.match(/\bawait\b/g) || []).length;
      expect(awaitCount).toBe(3);
      // Catch hands the error to the lexically captured reporter.
      expect(result).toContain(
        "} catch (__hoppScriptExecutionError) {"
      );
      expect(result).toContain("__hoppReporter(__hoppScriptExecutionError);");
    })