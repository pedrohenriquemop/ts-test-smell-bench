import { standardizeSmellList } from "../smells/catalog.ts";

export interface ParsedModelResponse {
  smells: string[];
  justification: string;
  reasoningLog?: string;
}

/**
 * Extracts smells from a model reply. Accepts JSON, the requested
 * `FILE: … - SMELLS: … - JUSTIFICATION: …` line, and the looser variants
 * small models tend to emit instead.
 */
export function parseModelResponse(
  response: string,
  useChainOfThought = false,
): ParsedModelResponse | null {
  let reasoningLog: string | undefined;
  let targetText = response;

  if (useChainOfThought) {
    reasoningLog = response
      .match(/<thinking\s*>([\s\S]*?)(?:<\/thinking\s*>|$)/i)?.[1]
      ?.trim();
    const classification = response
      .match(/<classification\s*>([\s\S]*?)(?:<\/classification\s*>|$)/i)?.[1]
      ?.trim();
    if (classification) targetText = classification;
  }

  const fromJson = parseJson(targetText);
  if (fromJson) return { ...fromJson, reasoningLog };

  const searchTexts =
    targetText !== response ? [targetText, response] : [targetText];
  for (const text of searchTexts) {
    const fromLine = parseClassificationLine(text);
    if (fromLine) return { ...fromLine, reasoningLog };
  }

  const conclusion = response.match(
    /only applicable smell is\s*\*\*?([^*]+)\*\*?/i,
  );
  if (conclusion) {
    return {
      smells: standardizeSmellList(conclusion[1]),
      justification: "Extracted from model concluding statement",
      reasoningLog,
    };
  }

  return null;
}

function parseJson(
  text: string,
): Omit<ParsedModelResponse, "reasoningLog"> | null {
  const jsonText = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    const value = JSON.parse(jsonText);
    if (!value || typeof value !== "object") return null;
    return {
      smells: standardizeSmellList(value.smells ?? value.SMELLS ?? []),
      justification: String(value.justification ?? value.JUSTIFICATION ?? ""),
    };
  } catch {
    return null;
  }
}

function parseClassificationLine(
  text: string,
): Omit<ParsedModelResponse, "reasoningLog"> | null {
  const labelled = text.match(
    /FILE:.*?- SMELLS:\s*(.*?)\s*[-–—]?\s*JUSTIFICATION:\s*(.*)/is,
  );
  if (labelled) {
    return {
      smells: standardizeSmellList(labelled[1]),
      justification: labelled[2].trim(),
    };
  }

  // The justification label is sometimes dropped: "SMELLS: X - explanation".
  const unlabelled = text.match(/FILE:.*?- SMELLS:\s*([^-\n]+?)\s*[-–—]\s*(.*)/is);
  if (unlabelled) {
    return {
      smells: standardizeSmellList(unlabelled[1]),
      justification: unlabelled[2].trim(),
    };
  }

  const smellsOnly = text.match(/FILE:.*?- SMELLS:\s*(.*)/is);
  if (smellsOnly) {
    return { smells: standardizeSmellList(smellsOnly[1]), justification: "" };
  }

  return null;
}
