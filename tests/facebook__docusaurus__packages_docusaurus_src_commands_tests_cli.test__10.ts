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

  describe('extendCLI', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('allows plugins to opt into modern option handling', async () => {
          const result = await testCommand([
            'cliPlugin:modern',
            '--label',
            'modern',
          ]);
          expect(result.exit).toBeUndefined();
          expect(JSON.parse(result.stdout)).toEqual({
            options: {label: 'modern'},
            name: 'cliPlugin:modern',
            separateOptions: true,
          });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});