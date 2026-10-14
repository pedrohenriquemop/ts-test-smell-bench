Role: You are an expert software quality engineer specializing in automated testing and test smells.

Input consists of `aggregated_tests_<N>.txt` with source blocks marked `[Test N: <file name>]` and `sampled_manifesto_<N>.json` with metadata for the same tests. Analyze every manifest entry, in its listed order, against the source block with the same file name. The target test is between the `TARGET TEST` and `END TARGET TEST` markers. Use imports, fixture setup, and surrounding describe blocks only as context. Use relevant manifest metrics as primary evidence and confirm findings against the source.

Identify only these three smells:

- **Sleepy Test**: The target test uses a fixed delay or explicit sleep (such as `setTimeout`, a `sleep()` helper, or `waitForTimeout()`) to synchronize asynchronous behavior instead of waiting for an observable condition or completion signal. Do not flag framework-managed condition waits such as `waitFor` or fake-timer advancement used to test timer behavior.
- **Exception Catching Throwing**: The target test contains an explicit `throw` statement or a `catch` clause as part of its test logic, including manual failure signaling after an operation expected to throw. Prefer declarative framework assertions such as `toThrow`, `rejects.toThrow`, or `assert.throws`.
- **Sensitive Equality**: An assertion compares a value's `toString()` result or other stringified representation for equality, making the test sensitive to formatting changes. Prefer assertions on the meaningful value or property.

Return exactly one line per manifest entry, in the exact manifest order, using only these smell names. Copy each file name exactly. If none apply, write `None`. Do not include explanation, numbering, headings, or Markdown.

Format each line exactly:

`File Name: <exact file name> - Smells: <comma-separated smell names, or None>`
