import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import path from 'path';
import {Command} from 'commander';
import {createCLIProgram} from '../cli';
import * as buildCommand from '../build/build';
import * as startCommand from '../start/start';
import * as serveCommand from '../serve';

const ExitOverrideError = new Error('exitOverride');
async function testCommand(args: string[]) {
  const cliArgs: [string, string, ...string[]] = [
    'node',
    'docusaurus',
    ...args,
  ];
  const siteDir = path.resolve(__dirname, '__fixtures__', 'site');

  let stdout = '';
  let stderr = '';
  const log = vi.spyOn(console, 'log').mockImplementation((msg: string) => {
    stdout += msg;
  });

  const command = new Command().configureOutput({
    writeOut: (str) => {
      stdout += str;
    },
    writeErr: (str) => {
      stderr += str;
    },
  });

  let exit: undefined | {code: string; exitCode: number};
  command.exitOverride((err) => {
    exit = {code: err.code, exitCode: err.exitCode};
    throw ExitOverrideError;
  });

  try {
    const cli = await createCLIProgram({
      cli: command,
      cliArgs,
      siteDir,
      config: undefined,
    });

    await cli.parseAsync(cliArgs);
  } catch (e) {
    if (e !== ExitOverrideError) {
      throw e;
    }
  } finally {
    log.mockRestore();
  }

  return {
    exit,
    stdout,
    stderr,
  };
}

describe('CLI', () => {

  describe('general', () => {

    describe('help', () => {

      // ── TARGET TEST ─────────────────────────────────
      it('docusaurus --help', async () => {
              const result = await testCommand(['--help']);

              expect(result).toMatchInlineSnapshot(`
                {
                  "exit": {
                    "code": "commander.helpDisplayed",
                    "exitCode": 0,
                  },
                  "stderr": "",
                  "stdout": "Usage: docusaurus <command> [options]

                Options:
                  -V, --version                                            output the version number
                  -h, --help                                               display help for command

                Commands:
                  build [options] [siteDir]                                Build website.
                  swizzle [options] [themeName] [componentName] [siteDir]  Wraps or ejects the original theme files into website folder for customization.
                  deploy [options] [siteDir]                               Deploy website to GitHub pages.
                  start [options] [siteDir]                                Start the development server.
                  serve [options] [siteDir]                                Serve website locally.
                  clear [siteDir]                                          Remove build artifacts.
                  write-translations [options] [siteDir]                   Extract required translations of your site.
                  write-heading-ids [options] [siteDir] [files...]         Generate heading ids in Markdown content.
                  cliPlugin:test [options]                                 Run test cli command
                ",
                }
              `);
            })
      // ── END TARGET TEST ─────────────────────────────
    });
  });
});