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

function parseRunFile(filePath: string, allowMissingFileNamePrefix = false): RunEntry[] {
  const entries = new Map<string, string[]>();

  for (const [index, line] of fs.readFileSync(filePath, "utf8").split(/\r?\n/).entries()) {
    const match = line.match(allowMissingFileNamePrefix
      ? /^\s*(?:File Name:\s*)?(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i
      : /^\s*File Name:\s*(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i);
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
 * Normal runs use strict-majority voting. Supplemental *_extra.txt runs
 * contain labels for additional smells and are unioned into that consensus.
 */
export function mergeGoldsetRuns(
  projectRoot = process.cwd(),
  runsDirArg = "goldset",
  outputFileArg = "goldset/run.txt",
): void {
  const runsDir = path.resolve(projectRoot, runsDirArg);
  const outputFile = path.resolve(projectRoot, outputFileArg);
  if (!fs.existsSync(runsDir)) throw new Error(`Goldset directory not found: ${runsDir}`);

  const files = fs.readdirSync(runsDir).filter((file) => /^run_.+\.txt$/i.test(file)).sort();
  const extraFiles = files.filter((file) => /_extra\.txt$/i.test(file));
  const runFiles = files
    .filter((file) => !/_extra\.txt$/i.test(file))
    .sort();
  if (runFiles.length < 2) {
    throw new Error(`At least two run_*.txt files are required in ${runsDir} to build a consensus.`);
  }

  // When run.txt already exists, it defines the curated test set and normal
  // labels. Rebuilding from the full model runs can silently expand that set.
  const hasExistingGoldset = fs.existsSync(outputFile);
  const consensus: FileConsensus[] = hasExistingGoldset
    ? parseRunFile(outputFile).map(({ file, smells }) => ({
        file, sourceCount: 0, requiredVotes: 0, smellVotes: {}, smells,
      }))
    : [];

  if (!hasExistingGoldset) {
    const votesByFile = new Map<string, Map<string, string[]>>();
    for (const runFile of runFiles) {
      for (const entry of parseRunFile(path.join(runsDir, runFile))) {
        const votes = votesByFile.get(entry.file) ?? new Map<string, string[]>();
        votes.set(runFile, entry.smells);
        votesByFile.set(entry.file, votes);
      }
    }
    if (!votesByFile.size) throw new Error(`No "File Name" results found in: ${runFiles.join(", ")}`);

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
  }

  // Extra runs annotate the same tests with additional smell categories.
  // Union those labels after consensus so their None values cannot erase
  // labels from the normal goldset.
  const consensusByFile = new Map(consensus.map((entry) => [entry.file, entry]));
  for (const extraFile of extraFiles) {
    for (const entry of parseRunFile(path.join(runsDir, extraFile), true)) {
      let target = consensusByFile.get(entry.file);
      if (!target) {
        if (hasExistingGoldset) continue;
        target = { file: entry.file, sourceCount: 0, requiredVotes: 0, smellVotes: {}, smells: [] };
        consensus.push(target);
        consensusByFile.set(entry.file, target);
      }
      target.smells = [...new Set([...target.smells, ...entry.smells])].sort((a, b) => a.localeCompare(b));
    }
  }

  const lines = [
    hasExistingGoldset
      ? '[LLM="Existing goldset with supplemental smell labels"]'
      : `[LLM="Consensus: strict majority of ${runFiles.length} sources"]`,
    ...consensus.map(({ file, smells }) => `File Name: ${file} - Smells: ${smells.length ? smells.join(", ") : "None"}`),
  ];
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");

  const reportFile = outputFile.replace(/\.txt$/i, "_consensus_report.json");
  let previousReport: { sources?: string[]; files?: FileConsensus[] } = {};
  if (hasExistingGoldset && fs.existsSync(reportFile)) {
    try {
      previousReport = JSON.parse(fs.readFileSync(reportFile, "utf8"));
    } catch {
      // A missing or outdated audit report does not prevent goldset merging.
    }
  }
  const previousFiles = new Map((previousReport.files ?? []).map((entry) => [entry.file, entry]));
  const reportFiles = consensus.map((entry) => {
    const previous = previousFiles.get(entry.file);
    return previous ? {
      ...entry,
      sourceCount: previous.sourceCount,
      requiredVotes: previous.requiredVotes,
      smellVotes: previous.smellVotes,
    } : entry;
  });
  fs.writeFileSync(reportFile, `${JSON.stringify({
    strategy: hasExistingGoldset ? "existing-goldset-plus-extra-label-union" : "strict-majority-plus-extra-label-union",
    sources: hasExistingGoldset ? previousReport.sources ?? [path.basename(outputFile)] : runFiles,
    extraSources: extraFiles,
    files: reportFiles,
  }, null, 2)}\n`, "utf8");
  console.log(`Merged ${extraFiles.length} extra runs into ${outputFile}${hasExistingGoldset ? " (existing test set preserved)" : ` using ${runFiles.length} normal runs`}`);
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
