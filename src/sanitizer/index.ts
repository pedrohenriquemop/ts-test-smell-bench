import * as fs from "fs";
import * as path from "path";
import { resultsSuffix, type AnalyzerConfig } from "../config/index.ts";
import { standardizeSmellList } from "../smells/catalog.ts";
import { parseModelResponse } from "../analyzer/response-parser.ts";

type ResultEntry = Record<string, any>;

/** The per-smell MATCH/PASS walkthrough some models emit before a `---` divider. */
function evaluationSection(response: string): string {
  return response.split(/^---\s*$/m, 1)[0];
}

/**
 * Keeps only smells marked [MATCH] when the list carries decision labels;
 * otherwise standardizes the names against the catalog.
 */
export function sanitizeModelSmells(smells: unknown): string[] {
  if (!Array.isArray(smells)) return standardizeSmellList(smells);

  const values = smells.filter((smell): smell is string => typeof smell === "string");
  if (!values.some((smell) => /\[(?:MATCH|PASS)\]/i.test(smell))) {
    return standardizeSmellList(values);
  }

  const matched = values.flatMap((smell) => {
    if (!/\[MATCH\]/i.test(smell)) return [];
    const label = smell.match(/^\s*(?:[-*]\s*)?(.+?)\s*:/)?.[1]?.trim();
    return label ? [label] : [];
  });
  return standardizeSmellList(matched);
}

/** Smells whose decision line in the evaluation section ends in MATCH. */
export function smellsMarkedMatch(response: string): string[] {
  const matches: string[] = [];
  for (const line of evaluationSection(response).split(/\r?\n/)) {
    const entry = line.match(/^\s*[-*]\s*([^:]+):\s*(.*)$/);
    if (!entry) continue;

    // Models often mention both words while reasoning; the last one is the verdict.
    const statuses = [...entry[2].matchAll(/\b(MATCH|PASS)\b/gi)];
    if (statuses.at(-1)?.[1]?.toUpperCase() === "MATCH") matches.push(entry[1].trim());
  }
  return standardizeSmellList(matches);
}

/** Re-parses responses that were saved as "invalid return" with the current parser. */
function recoverInvalidEntry(entry: ResultEntry): ResultEntry {
  const raw = entry.rawModelResponse;
  if (entry.modelStatus !== "invalid return" || typeof raw !== "string" || !raw.trim()) {
    return entry;
  }

  const parsed = parseModelResponse(raw, entry.cotEnabled ?? true);
  if (!parsed || (parsed.smells.length === 0 && !parsed.justification)) return entry;

  const recovered: ResultEntry = { ...entry, modelStatus: "success", modelSmells: parsed.smells };
  if (!recovered.modelJustification && parsed.justification) {
    recovered.modelJustification = parsed.justification;
  }
  if (!recovered.reasoningLog && parsed.reasoningLog) {
    recovered.reasoningLog = parsed.reasoningLog;
  }
  return recovered;
}

/**
 * In chain-of-thought replies the <classification> line is the model's answer;
 * its <thinking> often quotes "answer PASS" or says "match" in prose, so the
 * MATCH/PASS decision lines are only read from replies without that block.
 */
function finalAnswerSmells(raw: unknown): string[] | undefined {
  if (typeof raw !== "string") return undefined;
  if (/<classification\s*>/i.test(raw)) return parseModelResponse(raw, true)?.smells;
  if (DECISION_LINE.test(evaluationSection(raw))) return smellsMarkedMatch(raw);
  return undefined;
}

/** "- Assertion Roulette: … -> [MATCH]"; uppercase only, so prose like "strings match" is ignored. */
const DECISION_LINE = /^\s*[-*]\s*[^:\n]+:.*\b(?:MATCH|PASS)\b/m;

function sanitizeEntry(entry: ResultEntry): ResultEntry {
  const recovered = recoverInvalidEntry(entry);
  const raw = recovered.rawModelResponse;
  if (recovered.modelSmells === undefined && !raw) return recovered;

  const modelSmells = finalAnswerSmells(raw) ?? sanitizeModelSmells(recovered.modelSmells ?? []);

  return {
    ...recovered,
    modelSmells,
    ...(recovered.referenceSmells
      ? { referenceSmells: standardizeSmellList(recovered.referenceSmells) }
      : {}),
  };
}

/** Sanitizes modelSmells in one comparison-results file, preserving other fields. */
export function sanitizeResultsFile(inputPath: string): number {
  const results: unknown = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  if (!Array.isArray(results)) {
    throw new Error(`Expected an array of comparison results in ${inputPath}`);
  }

  let changed = 0;
  const sanitized = results.map((entry) => {
    if (!entry || typeof entry !== "object") return entry;
    const next = sanitizeEntry(entry);
    if (JSON.stringify(next) !== JSON.stringify(entry)) changed++;
    return next;
  });

  fs.writeFileSync(inputPath, JSON.stringify(sanitized, null, 2));
  return changed;
}

export function sanitizeComparisonResults(analyzer: AnalyzerConfig): number {
  const inputPath = path.resolve(
    analyzer.outputDir,
    `comparison_results${resultsSuffix(analyzer)}.json`,
  );
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Comparison results not found at ${inputPath}`);
  }
  const changed = sanitizeResultsFile(inputPath);
  console.log(`Sanitized ${changed} result entr${changed === 1 ? "y" : "ies"} in ${inputPath}`);
  return changed;
}
