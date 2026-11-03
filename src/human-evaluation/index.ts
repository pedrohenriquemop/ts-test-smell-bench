import * as fs from "node:fs";
import * as path from "node:path";
import { parseGoldsetLine } from "../goldset/format.ts";

interface Detection {
  model: string;
  smells: string[];
}

/**
 * Run files group results under `[LLM="<model>"]` headers. A model may label
 * a test only once per file; `*_extra.txt` files add labels for extra smells
 * from the same models, so detections across files are unioned per model.
 */
function readRunFile(filePath: string, detectionsByTest: Map<string, Detection[]>): void {
  const allowMissingPrefix = /_extra\.txt$/i.test(filePath);
  const seenInFile = new Map<string, string[]>();
  let model: string | undefined;

  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach((line, index) => {
    const header = line.match(/^\s*\[LLM="(.+)"\]\s*$/);
    if (header) {
      model = header[1].trim();
      return;
    }
    if (/^\s*\[/.test(line)) return;
    const entry = parseGoldsetLine(line, allowMissingPrefix);
    if (!entry) return;
    if (!model) throw new Error(`${filePath}:${index + 1}: result found before an LLM header.`);

    const key = `${model}\0${entry.file}`;
    const previous = seenInFile.get(key);
    if (previous && previous.join("\0") !== entry.smells.join("\0")) {
      throw new Error(`${filePath}:${index + 1}: ${model} has conflicting results for ${entry.file}.`);
    }
    seenInFile.set(key, entry.smells);

    const detections = detectionsByTest.get(entry.file) ?? [];
    const existing = detections.find((detection) => detection.model === model);
    if (existing) {
      existing.smells = [...new Set([...existing.smells, ...entry.smells])];
    } else {
      detections.push({ model, smells: entry.smells });
    }
    detectionsByTest.set(entry.file, detections);
  });
}

function buildAnnotation(detections: Detection[]): string {
  const lines = detections.map(
    ({ model, smells }) => ` * - ${model}: ${smells.length ? smells.join(", ") : "None"}`,
  );
  return ["", "/*", ...lines, " */", ""].join("\n");
}

/** Copies each labelled test with a trailing comment listing every model's verdict. */
export function generateHumanEvaluation(
  projectRoot = process.cwd(),
  runsDirArg = "goldset",
  testsDirArg = "tests",
  outputDirArg = "human_evaluation/processed_tests",
): void {
  const runsDir = path.resolve(projectRoot, runsDirArg);
  const testsDir = path.resolve(projectRoot, testsDirArg);
  const outputDir = path.resolve(projectRoot, outputDirArg);
  if (!fs.existsSync(runsDir)) throw new Error(`Runs directory not found: ${runsDir}`);
  if (!fs.existsSync(testsDir)) throw new Error(`Tests directory not found: ${testsDir}`);

  const runFiles = fs.readdirSync(runsDir).filter((file) => /^run_.+\.txt$/i.test(file)).sort();
  if (!runFiles.length) throw new Error(`No run_*.txt files found in ${runsDir}`);

  const detectionsByTest = new Map<string, Detection[]>();
  for (const runFile of runFiles) readRunFile(path.join(runsDir, runFile), detectionsByTest);

  fs.mkdirSync(outputDir, { recursive: true });
  for (const [testFile, detections] of detectionsByTest) {
    const source = path.resolve(testsDir, testFile);
    if (!source.startsWith(`${testsDir}${path.sep}`) || !fs.existsSync(source)) {
      throw new Error(`Test file not found: ${path.join(testsDir, testFile)}`);
    }
    const annotated = `${fs.readFileSync(source, "utf8").replace(/\s*$/, "")}${buildAnnotation(detections)}`;
    fs.writeFileSync(path.join(outputDir, testFile), annotated, "utf8");
  }
  console.log(`Created ${detectionsByTest.size} annotated test file(s) in ${outputDir}.`);
  console.log(`Read ${runFiles.length} run file(s): ${runFiles.join(", ")}`);
}
