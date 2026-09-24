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

  describe('internal commands', () => {
    beforeEach(() => {
          vi.spyOn(buildCommand, 'build').mockResolvedValue(undefined);
          vi.spyOn(startCommand, 'start').mockResolvedValue(undefined);
          vi.spyOn(serveCommand, 'serve').mockResolvedValue(undefined);
        });
    afterEach(() => {
          vi.restoreAllMocks();
        });

    // ── TARGET TEST ─────────────────────────────────
    it('preserves start host, port, polling, and negated options', async () => {
          await testCommand([
            'start',
            'website',
            '-h',
            '0.0.0.0',
            '-p',
            '4000',
            '--poll',
            '500',
            '--no-open',
            '--no-minify',
          ]);
          expect(startCommand.start).toHaveBeenCalledWith(
            'website',
            expect.objectContaining({
              host: '0.0.0.0',
              port: '4000',
              poll: 500,
              open: false,
              minify: false,
            }),
            expect.any(Command),
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});