import * as fs from "node:fs";
import * as path from "node:path";
import { formatGoldsetLine, parseGoldsetLine, type GoldsetEntry } from "./format.ts";

interface FileConsensus extends GoldsetEntry {
  sourceCount: number;
  requiredVotes: number;
  smellVotes: Record<string, number>;
}

/** Reads a run file, rejecting files that label the same test twice differently. */
function readRunFile(filePath: string, allowMissingPrefix = false): GoldsetEntry[] {
  const entries = new Map<string, string[]>();
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const entry = parseGoldsetLine(line, allowMissingPrefix);
    if (!entry) return;
    const previous = entries.get(entry.file);
    if (previous && previous.join("\0") !== entry.smells.join("\0")) {
      throw new Error(`${filePath}:${index + 1}: conflicting labels for ${entry.file}.`);
    }
    entries.set(entry.file, entry.smells);
  });

  return [...entries].map(([file, smells]) => ({ file, smells }));
}

function majorityVote(runsDir: string, runFiles: string[], allowMissingPrefix = false): FileConsensus[] {
  const votesByFile = new Map<string, string[][]>();
  for (const runFile of runFiles) {
    for (const { file, smells } of readRunFile(path.join(runsDir, runFile), allowMissingPrefix)) {
      votesByFile.set(file, [...(votesByFile.get(file) ?? []), smells]);
    }
  }
  if (!votesByFile.size) {
    throw new Error(`No "File Name" results found in: ${runFiles.join(", ")}`);
  }

  return [...votesByFile].map(([file, votes]) => {
    const requiredVotes = Math.floor(votes.length / 2) + 1;
    const counts = new Map<string, number>();
    for (const smell of votes.flat()) counts.set(smell, (counts.get(smell) ?? 0) + 1);

    return {
      file,
      sourceCount: votes.length,
      requiredVotes,
      smellVotes: Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b))),
      smells: [...counts]
        .filter(([, count]) => count >= requiredVotes)
        .map(([smell]) => smell)
        .sort((a, b) => a.localeCompare(b)),
    };
  });
}

/**
 * Combines independently produced goldset runs (`run_*.txt`) into one
 * reference file using strict-majority voting. Supplemental `*_extra.txt`
 * runs label additional smells; they are majority-voted among themselves and
 * the accepted labels are added to the base consensus.
 *
 * When the output already exists it defines the curated test set: labels are
 * always re-voted, but only for the tests already listed in it, so a re-run
 * cannot silently expand the set.
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
  const runFiles = files.filter((file) => !/_extra\.txt$/i.test(file));
  if (runFiles.length < 2) {
    throw new Error(`At least two run_*.txt files are required in ${runsDir} to build a consensus.`);
  }

  const hasExistingGoldset = fs.existsSync(outputFile);
  const voted = majorityVote(runsDir, runFiles);
  let consensus = voted;
  if (hasExistingGoldset) {
    const votedByFile = new Map(voted.map((entry) => [entry.file, entry]));
    consensus = readRunFile(outputFile).map(({ file }) => {
      const entry = votedByFile.get(file);
      if (!entry) throw new Error(`Test "${file}" from ${outputFile} has no votes in ${runFiles.join(", ")}.`);
      return entry;
    });
  }

  // Extra smells are voted on their own, then added, so their "None" cannot erase base labels.
  if (extraFiles.length > 0) {
    const extraByFile = new Map(majorityVote(runsDir, extraFiles, true).map((entry) => [entry.file, entry]));
    for (const target of consensus) {
      const extra = extraByFile.get(target.file);
      if (!extra) continue;
      target.smellVotes = Object.fromEntries(
        Object.entries({ ...target.smellVotes, ...extra.smellVotes }).sort(([a], [b]) => a.localeCompare(b)),
      );
      target.smells = [...new Set([...target.smells, ...extra.smells])].sort((a, b) => a.localeCompare(b));
    }
  }

  const header = `[LLM="Consensus: strict majority of ${runFiles.length} sources; extra smells voted separately"]`;
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${[header, ...consensus.map(formatGoldsetLine)].join("\n")}\n`, "utf8");

  const reportFile = writeConsensusReport(outputFile, consensus, runFiles, extraFiles);
  console.log(`Voted ${runFiles.length} runs and ${extraFiles.length} extra runs into ${outputFile}${hasExistingGoldset ? " (existing test set preserved)" : ""}`);
  console.log(`Wrote vote audit report: ${reportFile}`);
}

function writeConsensusReport(
  outputFile: string,
  consensus: FileConsensus[],
  runFiles: string[],
  extraFiles: string[],
): string {
  const reportFile = outputFile.replace(/\.txt$/i, "_consensus_report.json");
  fs.writeFileSync(reportFile, `${JSON.stringify({
    strategy: "strict-majority-plus-voted-extra-labels",
    sources: runFiles,
    extraSources: extraFiles,
    files: consensus,
  }, null, 2)}\n`, "utf8");
  return reportFile;
}

/**
 * Unions a supplemental run's labels into an existing goldset, writing to a
 * separate file so the base goldset stays intact.
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

  const merged = new Map<string, Set<string>>();
  for (const { file, smells } of [...readRunFile(baseFile), ...readRunFile(additionsFile)]) {
    const existing = merged.get(file) ?? new Set<string>();
    smells.forEach((smell) => existing.add(smell));
    merged.set(file, existing);
  }

  const lines = [
    '[LLM="Additive merge of existing and supplemental smell labels"]',
    ...[...merged].map(([file, smells]) => formatGoldsetLine({ file, smells: [...smells] })),
  ];
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");
  console.log(`Created augmented goldset: ${outputFile}`);
}
