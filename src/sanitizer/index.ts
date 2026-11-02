import * as fs from "fs";
import * as path from "path";
import { standardizeSmellList } from "../smells/catalog.ts";
import { parseOllamaResponse } from "../analyzer/providers/ollama.ts";

/**
 * Keep only model smell labels marked MATCH in structured model output,
 * or standardize plain smell-name arrays against canonical catalog display names.
 */
export function sanitizeModelSmells(smells: unknown): string[] {
  if (!Array.isArray(smells)) {
    return standardizeSmellList(smells);
  }

  const values = smells.filter(
    (smell): smell is string => typeof smell === "string",
  );
  const hasDecisionLabels = values.some((smell) =>
    /\[(?:MATCH|PASS)\]/i.test(smell),
  );
  if (!hasDecisionLabels) {
    return standardizeSmellList(values);
  }

  const matchedLabels = values.flatMap((smell) => {
    if (!/\[MATCH\]/i.test(smell)) return [];
    const label = smell.match(/^\s*(?:[-*]\s*)?(.+?)\s*:/)?.[1]?.trim();
    return label ? [label] : [];
  });

  return standardizeSmellList(matchedLabels);
}

/** Extract per-smell decisions from the model's detailed evaluation section. */
export function smellsMarkedMatch(response: string): string[] {
  const evaluation = response.split(/^---\s*$/m, 1)[0];
  const matches: string[] = [];

  for (const line of evaluation.split(/\r?\n/)) {
    const entry = line.match(/^\s*[-*]\s*([^:]+):\s*(.*)$/);
    if (!entry) continue;

    // The final status on the decision line wins, since some models mention
    // both MATCH and PASS in their explanatory text before the actual verdict.
    const statuses = [...entry[2].matchAll(/\b(MATCH|PASS)\b/gi)];
    const finalStatus = statuses.at(-1)?.[1]?.toUpperCase();
    if (finalStatus === "MATCH") matches.push(entry[1].trim());
  }

  return standardizeSmellList(matches);
}

/** Sanitize modelSmells in one comparison-results file, preserving other fields. */
export function sanitizeResultsFile(inputPath: string): number {
  const results: unknown = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  if (!Array.isArray(results)) {
    throw new Error(`Expected an array of comparison results in ${inputPath}`);
  }

  let changed = 0;
  const sanitized = results.map((entry: any) => {
    if (!entry || typeof entry !== "object") return entry;

    let updatedEntry = { ...entry };
    const rawResponse = entry.rawModelResponse ?? entry.rawOllamaResponse;
    const isInvalid =
      entry.modelStatus === "invalid return" ||
      entry.ollamaStatus === "invalid return";

    // Attempt recovery for invalid return entries
    if (isInvalid && typeof rawResponse === "string" && rawResponse.trim()) {
      const parsed = parseOllamaResponse(
        rawResponse,
        entry.cotEnabled ?? true,
      );
      if (parsed && (parsed.smells.length > 0 || parsed.justification)) {
        updatedEntry.modelStatus = "success";
        if (updatedEntry.ollamaStatus !== undefined) {
          updatedEntry.ollamaStatus = "success";
        }
        if (!updatedEntry.modelJustification && parsed.justification) {
          updatedEntry.modelJustification = parsed.justification;
        }
        if (
          updatedEntry.ollamaJustification !== undefined &&
          !updatedEntry.ollamaJustification &&
          parsed.justification
        ) {
          updatedEntry.ollamaJustification = parsed.justification;
        }
        if (!updatedEntry.reasoningLog && parsed.reasoningLog) {
          updatedEntry.reasoningLog = parsed.reasoningLog;
        }
        updatedEntry.modelSmells = parsed.smells;
        if (updatedEntry.ollamaSmells !== undefined) {
          updatedEntry.ollamaSmells = parsed.smells;
        }
      }
    }

    const current =
      updatedEntry.modelSmells ?? updatedEntry.ollamaSmells;
    if (current === undefined && !rawResponse) return updatedEntry;

    const fromDetailedResponse =
      typeof rawResponse === "string" ? smellsMarkedMatch(rawResponse) : [];
    const hasDetailedDecisions =
      typeof rawResponse === "string" &&
      /\b(?:MATCH|PASS)\b/i.test(rawResponse.split(/^---\s*$/m, 1)[0]);

    const modelSmells =
      fromDetailedResponse.length > 0 || hasDetailedDecisions
        ? fromDetailedResponse
        : sanitizeModelSmells(current ?? []);

    // Also standardize reference smells if present
    const currentRef = updatedEntry.referenceSmells ?? updatedEntry.geminiSmells;
    const standardizedRef = currentRef ? standardizeSmellList(currentRef) : undefined;

    const hadChanges =
      JSON.stringify(entry.modelSmells) !== JSON.stringify(modelSmells) ||
      (entry.ollamaSmells !== undefined &&
        JSON.stringify(entry.ollamaSmells) !== JSON.stringify(modelSmells)) ||
      entry.modelStatus !== updatedEntry.modelStatus ||
      (standardizedRef &&
        JSON.stringify(currentRef) !== JSON.stringify(standardizedRef));

    if (hadChanges) changed++;

    return {
      ...updatedEntry,
      modelSmells,
      ...(updatedEntry.ollamaSmells !== undefined
        ? { ollamaSmells: modelSmells }
        : {}),
      ...(standardizedRef && updatedEntry.referenceSmells !== undefined
        ? { referenceSmells: standardizedRef }
        : {}),
      ...(standardizedRef && updatedEntry.geminiSmells !== undefined
        ? { geminiSmells: standardizedRef }
        : {}),
    };
  });

  fs.writeFileSync(inputPath, JSON.stringify(sanitized, null, 2));
  return changed;
}

export function sanitizeComparisonResults(config: {
  analyzer: { outputDir: string; version?: string };
}): number {
  const suffix = config.analyzer.version
    ? `_v${config.analyzer.version}`
    : "";
  const inputPath = path.resolve(
    process.cwd(),
    config.analyzer.outputDir,
    `comparison_results${suffix}.json`,
  );
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Comparison results not found at ${inputPath}`);
  }
  const changed = sanitizeResultsFile(inputPath);
  console.log(
    `Sanitized ${changed} result entr${changed === 1 ? "y" : "ies"} in ${inputPath}`,
  );
  return changed;
}
