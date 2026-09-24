import {describe, expect, it} from 'vitest';
import path from 'path';
import stylelint from 'stylelint';
import rule from '../index';

type TestSuite = {
  ruleName: string;
  fix: boolean;
  accept: TestCase[];
  reject: TestCase[];
};
type TestCase = {
  code: string;
  description?: string;
  fixed?: string;
  message?: string;
  line?: number;
  column?: number;
};
function getOutputCss(output: stylelint.LinterResult) {
  const result = output.results[0]!._postcssResult!;
  return result.root.toString(result.opts!.syntax);
}

describe(`${tests.ruleName}`, () => {
  const checkTestCaseContent = (testCase: TestCase) =>
        testCase.description ?? testCase.code;

  describe('accept cases', () => {

    // ── TARGET TEST ─────────────────────────────────
    it(`${checkTestCaseContent(testCase)}`, async () => {
              const options: stylelint.LinterOptions = {
                code: testCase.code,
                config,
              };

              const output = await stylelint.lint(options);
              expect(output.results[0]!.warnings).toEqual([]);
              if (!tests.fix) {
                return;
              }
              const fixedOutput = await stylelint.lint({...options, fix: true});
              const fixedCode = getOutputCss(fixedOutput);
              expect(fixedCode).toBe(testCase.code);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});
testStylelintRule(
  {
    plugins: [path.join(__dirname, '../../lib/index.js')],
    rules: {
      [rule.ruleName]: [true, {header: '*\n * Copyright'}],
    },
  },
  {
    ruleName: rule.ruleName,
    fix: true,
    accept: [
      {
        code: `
/**
 * Copyright
 */
.foo {}`,
      },
      {
        code: `/**
 * Copyright
 */

.foo {}`,
      },
      {
        code: `/**
 * Copyright
 */
.foo {}`,
      },
    ],
    reject: [
      {
        code: `.foo {}`,
        fixed: `/**
 * Copyright
 */
.foo {}`,
        message:
          'Missing copyright in the header comment (docusaurus/copyright-header)',
        line: 1,
        column: 1,
      },
      {
        code: `
.foo {}`,
        fixed: `/**
 * Copyright
 */
.foo {}`,
        message:
          'Missing copyright in the header comment (docusaurus/copyright-header)',
        line: 1,
        column: 1,
      },
      {
        code: `/**
* Copyright
*/

.foo {}`,
        fixed: `/**
 * Copyright
 */

/**
* Copyright
*/

.foo {}`,
        message:
          'Missing copyright in the header comment (docusaurus/copyright-header)',
        line: 1,
        column: 1,
      },
      {
        code: `/**
 * Copyleft
 */

.foo {}`,
        fixed: `/**
 * Copyright
 */

/**
 * Copyleft
 */

.foo {}`,
        message:
          'Missing copyright in the header comment (docusaurus/copyright-header)',
        line: 1,
        column: 1,
      },
      {
        code: `/**
 * Copyleft
 */

/**
 * Copyright
 */
 .foo {}`,
        fixed: `/**
 * Copyright
 */

/**
 * Copyleft
 */

/**
 * Copyright
 */
 .foo {}`,
        message:
          'Missing copyright in the header comment (docusaurus/copyright-header)',
        line: 1,
        column: 1,
      },
    ],
  },
);