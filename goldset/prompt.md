Role: You are an expert Software Quality Engineer specializing in Automated Testing and Technical Debt.

Context: I am providing you with two files:

aggregated_tests.txt: Contains the raw TypeScript source code for multiple test files, separated by markers.

sampled_manifesto.json: Contains metadata and AST-extracted metrics for these tests (line count, assertion count, control flow structures, etc.).

The sample is given in parts across messages: each part uses these same two filenames with new contents, sometimes after a brief instruction. Apply this task to each part the same way.

Task: Analyze the specific files listed below and identify the presence of any of the following 7 Test Smells:

Assertion Roulette: Multiple assertions in one test without descriptive messages.

Eager Test: A test verifying too many different behaviors/objectives.

Conditional Test Logic: Presence of if, for, switch, or ternary operators within the test.

General Fixture: Excessive setup in beforeEach where only a fraction is used by the test.

Mystery Guest: Dependencies on external resources (files/DBs) not explicitly defined in the test.

Magic Number: Hardcoded strings or numbers used as logic inputs without context.

Resource Optimism: Assuming external resources (API/File System) are always available without error handling.

Instructions:

Cross-reference the source code in aggregated_tests.txt with the metrics provided in sampled_manifesto.json for each file.

Use the metrics (e.g., assertionCount, controlFlowCount) as primary evidence for your diagnosis.

If no smells are found, state "None".

Output Format (Plain List Only):
File Name: [Name] - Smells: [Smell 1, Smell 2]
