import * as fs from "node:fs";

/** One `File Name: <file> - Smells: <a, b | None>` line of a goldset/run file. */
export interface GoldsetEntry {
  file: string;
  smells: string[];
}

const LINE = /^\s*File Name:\s*(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i;
const LINE_WITHOUT_PREFIX = /^\s*(?:File Name:\s*)?(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i;

export function parseGoldsetLine(
  line: string,
  allowMissingPrefix = false,
): GoldsetEntry | null {
  const match = line.match(allowMissingPrefix ? LINE_WITHOUT_PREFIX : LINE);
  if (!match) return null;

  const smellsText = match[2].trim();
  const smells =
    !smellsText || /^none$/i.test(smellsText)
      ? []
      : [...new Set(smellsText.split(",").map((s) => s.trim()).filter(Boolean))];
  return { file: match[1].trim(), smells };
}

/** Entries in file order; non-matching lines (headers, blanks) are skipped. */
export function readGoldsetFile(
  filePath: string,
  allowMissingPrefix = false,
): GoldsetEntry[] {
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => parseGoldsetLine(line, allowMissingPrefix))
    .filter((entry): entry is GoldsetEntry => entry !== null);
}

export function formatGoldsetLine({ file, smells }: GoldsetEntry): string {
  return `File Name: ${file} - Smells: ${smells.length ? smells.join(", ") : "None"}`;
}
