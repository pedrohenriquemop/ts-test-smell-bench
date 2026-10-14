import * as fs from "node:fs";
import * as path from "node:path";

interface RunEntry {
  file: string;
  smells: string[];
}

interface FileConsensus {
  file: string;
  sourceCount: number;
  requiredVotes: number;
  smellVotes: Record<string, number>;
  smells: string[];
}

function parseRunFile(filePath: string): RunEntry[] {
  const entries = new Map<string, string[]>();

  for (const [index, line] of fs.readFileSync(filePath, "utf8").split(/\r?\n/).entries()) {
    const match = line.match(/^\s*File Name:\s*(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i);
    if (!match) continue;

    const smellsText = match[2].trim();
    const smells = !smellsText || /^none$/i.test(smellsText)
      ? []
      : [...new Set(smellsText.split(",").map((smell) => smell.trim()).filter(Boolean))];
    const file = match[1].trim();
    const previous = entries.get(file);
    if (previous && previous.join("\0") !== smells.join("\0")) {
      throw new Error(`${filePath}:${index + 1}: conflicting labels for ${file}.`);
    }
    entries.set(file, smells);
  }

  return [...entries].map(([file, smells]) => ({ file, smells }));
}

/**
 * Combines independently produced goldset runs into one reference file.
 *
 * A smell is accepted only when a strict majority of the sources that
 * labelled that test agree.  Thus two sources must both agree, and three
 * sources require two votes; ties are deliberately excluded.
 */
export function mergeGoldsetRuns(
  projectRoot = process.cwd(),
  runsDirArg = "goldset",
  outputFileArg = "goldset/run.txt",
): void {
  const runsDir = path.resolve(projectRoot, runsDirArg);
  const outputFile = path.resolve(projectRoot, outputFileArg);
  if (!fs.existsSync(runsDir)) throw new Error(`Goldset directory not found: ${runsDir}`);

  const runFiles = fs.readdirSync(runsDir)
    .filter((file) => /^run_.+\.txt$/i.test(file))
    .sort();
  if (runFiles.length < 2) {
    throw new Error(`At least two run_*.txt files are required in ${runsDir} to build a consensus.`);
  }

  const votesByFile = new Map<string, Map<string, string[]>>();
  for (const runFile of runFiles) {
    for (const entry of parseRunFile(path.join(runsDir, runFile))) {
      const votes = votesByFile.get(entry.file) ?? new Map<string, string[]>();
      votes.set(runFile, entry.smells);
      votesByFile.set(entry.file, votes);
    }
  }
  if (!votesByFile.size) throw new Error(`No "File Name" results found in: ${runFiles.join(", ")}`);

  const consensus: FileConsensus[] = [];
  for (const [file, sourceVotes] of votesByFile) {
    const sourceCount = sourceVotes.size;
    const requiredVotes = Math.floor(sourceCount / 2) + 1;
    const counts = new Map<string, number>();
    for (const smells of sourceVotes.values()) {
      for (const smell of smells) counts.set(smell, (counts.get(smell) ?? 0) + 1);
    }
    const smellVotes = Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b)));
    consensus.push({
      file,
      sourceCount,
      requiredVotes,
      smellVotes,
      smells: [...counts]
        .filter(([, count]) => count >= requiredVotes)
        .map(([smell]) => smell)
        .sort((a, b) => a.localeCompare(b)),
    });
  }

  const lines = [
    `[LLM="Consensus: strict majority of ${runFiles.length} sources"]`,
    ...consensus.map(({ file, smells }) => `File Name: ${file} - Smells: ${smells.length ? smells.join(", ") : "None"}`),
  ];
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");

  const reportFile = outputFile.replace(/\.txt$/i, "_consensus_report.json");
  fs.writeFileSync(reportFile, `${JSON.stringify({ strategy: "strict-majority", sources: runFiles, files: consensus }, null, 2)}\n`, "utf8");
  console.log(`Created consensus goldset from ${runFiles.length} source runs: ${outputFile}`);
  console.log(`Wrote vote audit report: ${reportFile}`);
}

/**
 * Adds labels from a supplemental run to an existing goldset by unioning
 * smell names per file. Missing files and prior labels are preserved.
 * Writes to a separate output by default so the base goldset stays intact.
 */
export function mergeGoldsetAdditions(
  projectRoot = process.cwd(),
  baseFileArg = "goldset/run.txt",
  additionsFileArg = "goldset/run_new_smells.txt",
  outputFileArg = "goldset/run_augmented.txt",
): void {
  const baseFile = path.resolve(projectRoot, baseFileArg);
  const additionsFile = path.resolve(projectRoot, additionsFileArg);
  const outputFile = path.resolve(projectRoot, outputFileArg);
  if (outputFile === baseFile || outputFile === additionsFile) {
    throw new Error("Augmented goldset output must be a separate file.");
  }
  if (!fs.existsSync(baseFile)) throw new Error(`Base goldset not found: ${baseFile}`);
  if (!fs.existsSync(additionsFile)) throw new Error(`Supplemental goldset not found: ${additionsFile}`);

  const baseEntries = parseRunFile(baseFile);
  const additionEntries = parseRunFile(additionsFile);
  const merged = new Map<string, string[]>();
  for (const entry of baseEntries) merged.set(entry.file, [...entry.smells]);
  for (const entry of additionEntries) {
    const smells = new Set(merged.get(entry.file) ?? []);
    for (const smell of entry.smells) smells.add(smell);
    merged.set(entry.file, [...smells]);
  }

  const lines = [
    '[LLM="Additive merge of existing and supplemental smell labels"]',
    ...[...merged].map(([file, smells]) =>
      `File Name: ${file} - Smells: ${smells.length ? smells.join(", ") : "None"}`,
    ),
  ];
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");
  console.log(`Created augmented goldset: ${outputFile}`);
}
