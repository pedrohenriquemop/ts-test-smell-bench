Role: You are an expert Software Quality Engineer specializing in Automated Testing and Technical Debt.

Context: I am providing one batch as two uploaded files:

- `aggregated_tests_<N>.txt`: TypeScript source for 50 tests. Each test is delimited by a marker in the form `[Test N: <file name>]`.
- `sampled_manifesto_<N>.json`: Metadata and AST-extracted metrics for the same 50 tests, in the required output order.

Analyze each manifest entry against the source block with the same file name. The source block contains the target test between `TARGET TEST` and `END TARGET TEST` markers; imports, setup, and describe context are supplied only to provide context.

Task: Identify the presence of any of the following 8 Test Smells:

Assertion Roulette: Multiple assertions in one test without descriptive messages.

Eager Test: A test verifying too many different behaviors/objectives.

Conditional Test Logic: Presence of if, for, switch, while, or ternary operators within the target test.

General Fixture: Excessive setup in beforeEach/beforeAll where only a fraction is used by the target test.

Mystery Guest: Dependencies on external resources, files, databases, helpers, mocks, or data not explicitly defined in the visible test code.

Hardcoded Literal: Raw, unexplained domain strings used as behavioral inputs instead of declared constants. Do not flag strings used only in assertions.

Magic Number: Raw, unexplained numbers used as behavioral inputs. Do not flag numbers used only as expected values in assertions.

Resource Optimism: Assuming external resources (API, file system, database) are always available without error handling or an existence/availability check.

Instructions:

- Analyze every entry in `sampled_manifesto_<N>.json`, in its listed order.
- Cross-reference the target source block with its AST metrics. Treat metrics such as `assertionCount`, `assertionsWithoutMessages`, `controlFlowCount`, `hardcodedLiteralCount`, `beforeEachVarCount`, and `externalModuleRefs` as primary evidence; use the source and context to confirm the applicable smell.
- For Assertion Roulette, flag only when there are at least two assertions and at least two lack descriptive messages.
- For Conditional Test Logic, flag when `controlFlowCount` is at least 1 and the control flow is inside the target test.
- If no smells apply, output `None`.

Output format — strict:

- Return exactly 50 lines: one line for every manifest entry.
- Keep the lines in the exact manifest order.
- Copy the file name exactly from the manifest entry or its `[Test N: ...]` marker.
- Use only the eight smell names written above, with the same spelling and capitalization.
- Return plain text only: no introduction, reasoning, headings, Markdown, numbering, code fences, or explanations.

Each line must be exactly:

File Name: <exact file name> - Smells: <comma-separated smell names, or None>

Example:

File Name: firecrawl__firecrawl__rollout.test__0.ts - Smells: Assertion Roulette, Magic Number
