import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Parameter to control the number of tests processed
const NUM_TESTS = 5;

async function analyzeTest(testCode: string, metadata: any) {
  const prompt = `
    Analyze the following TypeScript test:
    
    AST METADATA:
    ${JSON.stringify(metadata, null, 2)}
    
    CODE:
    ${testCode}
    
    Respond only in the following format:
    FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]
  `;

  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'detector-smells',
    prompt: prompt,
    stream: false
  });

  return response.data;
}

function parseGeminiFile(filePath: string): Array<{ file: string, smells: string[] }> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const results = [];

  for (const line of lines) {
    // Expected format: File Name: <filename> - Smells: <smells>
    const match = line.match(/File Name:\s*(.*?)\s*-\s*Smells:\s*(.*)/i);
    if (match) {
      const fileName = match[1].trim();
      const smellsStr = match[2].trim();
      let smells: string[] = [];
      if (smellsStr.toLowerCase() !== 'none') {
         smells = smellsStr.split(',').map(s => s.trim());
      }
      results.push({ file: fileName, smells });
    }
  }

  return results;
}

function parseOllamaResponse(response: string): { smells: string[], justification: string } | null {
  // format: FILE: [NAME] - SMELLS: [LIST] - JUSTIFICATION: [SHORT]
  const match = response.match(/FILE:.*?- SMELLS:\s*(.*?)\s*- JUSTIFICATION:\s*(.*)/si);
  if (match) {
    const smellsStr = match[1].trim();
    const justification = match[2].trim();
    let smells: string[] = [];
    if (smellsStr.toLowerCase() !== 'none' && smellsStr !== '[]' && smellsStr !== '') {
        smells = smellsStr.split(',').map(s => s.trim());
    }
    return { smells, justification };
  }
  return null;
}

async function run() {
  const manifestPath = path.join(process.cwd(), 'manifesto_tests.json');
  const geminiPath = path.join(process.cwd(), 'src', 'gemini_run.txt');
  const testsDir = path.join(process.cwd(), 'tests');

  console.log("Loading metadata...");
  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const metricsMap = new Map();
  for (const item of manifestData) {
    metricsMap.set(item.file, item.metrics);
  }

  console.log("Parsing Gemini results...");
  const geminiResults = parseGeminiFile(geminiPath);
  const testsToRun = geminiResults.slice(0, NUM_TESTS);

  const comparisonResults = [];

  console.log(`Starting analysis for ${testsToRun.length} tests...`);

  for (let i = 0; i < testsToRun.length; i++) {
    const testInfo = testsToRun[i];
    const fileName = testInfo.file;
    const geminiSmells = testInfo.smells;
    
    console.log(`\n[${i+1}/${testsToRun.length}] Processing ${fileName}...`);
    
    const testFilePath = path.join(testsDir, fileName);
    if (!fs.existsSync(testFilePath)) {
      console.warn(`Warning: Test file ${testFilePath} not found. Skipping.`);
      continue;
    }

    const testCode = fs.readFileSync(testFilePath, 'utf-8');
    const metadata = metricsMap.get(fileName);

    if (!metadata) {
       console.warn(`Warning: Metadata for ${fileName} not found. Skipping.`);
       continue;
    }

    try {
      const ollamaData = await analyzeTest(testCode, metadata);
      const ollamaRawResponse = ollamaData.response;
      const parsedOllama = parseOllamaResponse(ollamaRawResponse);

      let ollamaSmells: string[] = [];
      let ollamaJustification = '';
      let status = 'success';

      if (parsedOllama) {
        ollamaSmells = parsedOllama.smells;
        ollamaJustification = parsedOllama.justification;
      } else {
        console.error(`Invalid return format from Ollama for ${fileName}`);
        status = 'invalid return';
      }

      const result = {
        file: fileName,
        geminiSmells,
        ollamaSmells,
        ollamaStatus: status,
        ollamaJustification,
        rawOllamaResponse: ollamaRawResponse,
        ollamaFullPayload: ollamaData
      };

      comparisonResults.push(result);

      console.log(`  Gemini Smells: ${geminiSmells.join(', ') || 'None'}`);
      if (status === 'success') {
          console.log(`  Ollama Smells: ${ollamaSmells.join(', ') || 'None'}`);
      } else {
          console.log(`  Ollama Smells: [Invalid Format]`);
      }

    } catch (error) {
      console.error(`Error running analysis for ${fileName}:`, error);
      comparisonResults.push({
        file: fileName,
        geminiSmells,
        ollamaSmells: [],
        ollamaStatus: 'error',
        error: String(error)
      });
    }
  }

  const outputPath = path.join(process.cwd(), 'out', 'comparison_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(comparisonResults, null, 2));
  console.log(`\nAnalysis complete. Results saved to ${outputPath}`);
}

run();