import * as fs from "node:fs";
import * as path from "node:path";

interface Detection {
  model: string;
  smells: string[];
}

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
    if (!model) throw new Error(`${filePath}:${index + 1}: result found before an LLM header.`);

    const smells = /^none$/i.test(resultMatch[2].trim()) || resultMatch[2].trim() === ""
      ? []
      : resultMatch[2].split(",").map((smell) => smell.trim()).filter(Boolean);
    const detections = results.get(resultMatch[1].trim()) ?? [];
    const previous = detections.find((detection) => detection.model === model);
    if (previous && previous.smells.join("\0") !== smells.join("\0")) {
      throw new Error(`${filePath}:${index + 1}: ${model} has conflicting results for ${resultMatch[1].trim()}.`);
    }
    if (!previous) detections.push({ model, smells });
    results.set(resultMatch[1].trim(), detections);
  }
  return results;
}

function buildAnnotation(detections: Detection[]): string {
  return ["", "/*", ...detections.map(({ model, smells }) => ` * - ${model}: ${smells.length ? smells.join(", ") : "None"}`), " */", ""].join("\n");
}

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
  for (const runFile of runFiles) {
    for (const [testFile, detections] of parseRunFile(path.join(runsDir, runFile))) {
      const existing = detectionsByTest.get(testFile) ?? [];
      for (const detection of detections) {
        const previous = existing.find((item) => item.model === detection.model);
        if (previous && previous.smells.join("\0") !== detection.smells.join("\0")) {
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
    fs.writeFileSync(path.join(outputDir, testFile), `${fs.readFileSync(source, "utf8").replace(/\s*$/, "")}${buildAnnotation(detections)}`, "utf8");
    written++;
  }
  console.log(`Created ${written} annotated test file(s) in ${outputDir}.`);
  console.log(`Read ${runFiles.length} run file(s): ${runFiles.join(", ")}`);
}
