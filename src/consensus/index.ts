import * as fs from "fs";
import * as path from "path";
import { formatGoldsetLine } from "../goldset/format.ts";

export interface ConsensusOptions {
  /** Directory containing comparison_results_v*.json files. */
  resultsDir: string;
  /** Run tags to include (e.g. "llama3.1-8b__chain-of-thought-ast-ctx"). */
  versionTags: string[];
  /** Fraction of runs that must report a smell for it to be accepted. */
  threshold: number;
  outputPath: string;
  writeReport: boolean;
}

interface FileVote {
  file: string;
  modelVotes: Record<string, string[]>;
  consensusSmells: string[];
  /** Smells reported by some runs but below the threshold, with vote counts. */
  disagreements: string[];
}

/** Builds a goldset from several model runs by threshold voting per smell. */
export function buildConsensus(opts: ConsensusOptions): FileVote[] {
  const { resultsDir, versionTags, threshold, outputPath, writeReport } = opts;

  const votesByFile = new Map<string, Map<string, string[]>>();
  for (const tag of versionTags) {
    const filePath = path.join(resultsDir, `comparison_results_v${tag}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ Results file not found for tag "${tag}": ${filePath}`);
      continue;
    }

    const results: Array<{ file: string; modelSmells?: string[]; modelStatus?: string }> =
      JSON.parse(fs.readFileSync(filePath, "utf-8"));
    for (const entry of results) {
      if (entry.modelStatus !== "success") continue;
      const smells = (entry.modelSmells ?? [])
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.toLowerCase() !== "none");
      const fileVotes = votesByFile.get(entry.file) ?? new Map<string, string[]>();
      fileVotes.set(tag, smells);
      votesByFile.set(entry.file, fileVotes);
    }
  }

  const runCount = versionTags.length;
  const minVotes = Math.ceil(runCount * threshold);
  const votes: FileVote[] = [...votesByFile].map(([file, modelVotes]) => {
    const counts = new Map<string, number>();
    for (const smell of [...modelVotes.values()].flat()) {
      counts.set(smell, (counts.get(smell) ?? 0) + 1);
    }
    const accepted = [...counts].filter(([, count]) => count >= minVotes);
    const rejected = [...counts].filter(([, count]) => count < minVotes);
    return {
      file,
      modelVotes: Object.fromEntries(modelVotes),
      consensusSmells: accepted.map(([smell]) => smell),
      disagreements: rejected.map(([smell, count]) => `${smell} (${count}/${runCount} models)`),
    };
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    votes.map((v) => formatGoldsetLine({ file: v.file, smells: v.consensusSmells })).join("\n"),
  );
  console.log(
    `\n✅ Consensus goldset written to ${outputPath} (${votes.length} files, threshold: ${threshold})`,
  );

  if (writeReport) {
    const reportPath = outputPath.replace(/\.[^.]+$/, "_disagreements.json");
    const conflicts = votes.filter((v) => v.disagreements.length > 0);
    fs.writeFileSync(reportPath, JSON.stringify(conflicts, null, 2));
    console.log(
      `📊 Disagreement report written to ${reportPath} (${conflicts.length} files with conflicts)`,
    );
  }

  return votes;
}
