#!/usr/bin/env npx tsx

/**
 * Produces annotated copies of the tests referenced by goldset/run_*.txt.
 *
 * Usage:
 *   npx tsx human_evaluation/prepare-human-evaluation.ts
 *   npx tsx human_evaluation/prepare-human-evaluation.ts [runs-dir] [tests-dir] [output-dir]
 */
import * as fs from "node:fs";
import * as path from "node:path";

interface Detection {
  model: string;
  smells: string[];
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const [runsDirArg, testsDirArg, outputDirArg] = process.argv.slice(2);
const runsDir = path.resolve(projectRoot, runsDirArg ?? "goldset");
const testsDir = path.resolve(projectRoot, testsDirArg ?? "tests");
const outputDir = path.resolve(
  projectRoot,
  outputDirArg ?? "human_evaluation/processed_tests"
);

function parseRunFile(filePath: string): Map<string, Detection[]> {
  const results = new Map<string, Detection[]>();
  let model: string | undefined;

  for (const [index, line] of fs.readFileSync(filePath, "utf8").split(/\r?\n/).entries()) {
    const modelMatch = line.match(/^\s*\[LLM="(.+)"\]\s*$/);
    if (modelMatch) {
      model = modelMatch[1].trim();
      continue;
    }

    const resultMatch = line.match(/^\s*File Name:\s*(.+?)\s+-\s+Smells:\s*(.*?)\s*$/i);
    if (!resultMatch) continue;
    if (!model) {
      throw new Error(`${filePath}:${index + 1}: result found before an LLM header.`);
    }

    const fileName = resultMatch[1].trim();
    const rawSmells = resultMatch[2].trim();
    const smells = /^none$/i.test(rawSmells) || rawSmells === ""
      ? []
      : rawSmells.split(",").map((smell) => smell.trim()).filter(Boolean);
    const detections = results.get(fileName) ?? [];

    const previous = detections.find((detection) => detection.model === model);
    if (previous) {
      if (previous.smells.join("\u0000") !== smells.join("\u0000")) {
        throw new Error(
          `${filePath}:${index + 1}: ${model} has conflicting results for ${fileName}.`
        );
      }
    } else {
      detections.push({ model, smells });
      results.set(fileName, detections);
    }
  }

  return results;
}

function buildAnnotation(detections: Detection[]): string {
  const lines = ["", "/*", " * Human-evaluation annotations (LLM detections):"];
  for (const { model, smells } of detections) {
    lines.push(` * - ${model}: ${smells.length > 0 ? smells.join(", ") : "None"}`);
  }
  lines.push(" */", "");
  return lines.join("\n");
}

function main(): void {
  if (!fs.existsSync(runsDir)) throw new Error(`Runs directory not found: ${runsDir}`);
  if (!fs.existsSync(testsDir)) throw new Error(`Tests directory not found: ${testsDir}`);

  const runFiles = fs.readdirSync(runsDir)
    .filter((file) => /^run_.+\.txt$/i.test(file))
    .sort();
  if (runFiles.length === 0) throw new Error(`No run_*.txt files found in ${runsDir}`);

  const detectionsByTest = new Map<string, Detection[]>();
  for (const runFile of runFiles) {
    for (const [testFile, detections] of parseRunFile(path.join(runsDir, runFile))) {
      const existing = detectionsByTest.get(testFile) ?? [];
      for (const detection of detections) {
        const previous = existing.find((item) => item.model === detection.model);
        if (previous && previous.smells.join("\u0000") !== detection.smells.join("\u0000")) {
          throw new Error(`Conflicting results for ${testFile} from model ${detection.model}.`);
        }
        if (!previous) existing.push(detection);
      }
      detectionsByTest.set(testFile, existing);
    }
  }

  fs.mkdirSync(outputDir, { recursive: true });
  let written = 0;
  for (const [testFile, detections] of detectionsByTest) {
    const source = path.resolve(testsDir, testFile);
    if (!source.startsWith(`${testsDir}${path.sep}`) || !fs.existsSync(source)) {
      throw new Error(`Test file not found: ${path.join(testsDir, testFile)}`);
    }
    const destination = path.join(outputDir, testFile);
    const sourceText = fs.readFileSync(source, "utf8").replace(/\s*$/, "");
    fs.writeFileSync(destination, `${sourceText}${buildAnnotation(detections)}`, "utf8");
    written++;
  }

  console.log(`Created ${written} annotated test file(s) in ${outputDir}.`);
  console.log(`Read ${runFiles.length} run file(s): ${runFiles.join(", ")}`);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${(error as Error).message}`);
  process.exitCode = 1;
}
