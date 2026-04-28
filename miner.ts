import { Octokit } from "@octokit/rest";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface MinerConfig {
  minStars: number;
  language: string;
  maxRepos: number;
  maxFilesPerRepo: number;
  globalFileLimit: number;
  cooldownMs: number;
  outputDir: string;
  heuristics: {
    minLines: number;
    minAssertions: number;
  };
}

const CONFIG: MinerConfig = {
  minStars: 200,
  language: "typescript",
  maxRepos: 50,
  maxFilesPerRepo: 50,
  globalFileLimit: 500,
  cooldownMs: 500,
  outputDir: "./tests",
  heuristics: {
    minLines: 10,
    minAssertions: 0,
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir);
}

async function mineTests() {
  console.log("Starting miner...");
  const manifesto: any[] = [];
  let totalDownloaded = 0;

  try {
    const {
      data: { items: repos },
    } = await octokit.search.repos({
      q: `language:${CONFIG.language} stars:>${CONFIG.minStars}`,
      sort: "stars",
      per_page: CONFIG.maxRepos,
    });

    for (const repo of repos) {
      if (totalDownloaded >= CONFIG.globalFileLimit) break;

      console.log(`\nRepo name: ${repo.full_name}`);
      let filesMinedInThisRepo = 0;

      try {
        const searchResponse = await octokit.search.code({
          q: `repo:${repo.full_name} extension:ts describe`,
        });

        const testFiles = searchResponse.data.items.filter((file) =>
          /[\/\\](test|spec|__tests__)[\/\\]/i.test(file.path)
        );

        for (const file of testFiles) {
          if (
            filesMinedInThisRepo >= CONFIG.maxFilesPerRepo ||
            totalDownloaded >= CONFIG.globalFileLimit
          )
            break;

          try {
            const { data: contentData } = (await octokit.repos.getContent({
              owner: repo.owner?.login || "",
              repo: repo.name,
              path: file.path,
            })) as any;

            const content = Buffer.from(contentData.content, "base64").toString(
              "utf-8"
            );
            const assertionCount = (content.match(/expect\(/g) || []).length;
            const lineCount = content.split("\n").length;

            if (
              lineCount > CONFIG.heuristics.minLines ||
              assertionCount > CONFIG.heuristics.minAssertions
            ) {
              const fileName = `${repo.full_name.replace(/\//g, "__")}__${
                file.name
              }`;
              const filePath = path.join(CONFIG.outputDir, fileName);

              fs.writeFileSync(filePath, content);

              manifesto.push({
                file: fileName,
                repo: repo.full_name,
                metrics: { lineCount, assertionCount },
                originalPath: file.path,
              });

              filesMinedInThisRepo++;
              totalDownloaded++;
              console.log(
                `\t> Saved: ${fileName} (${totalDownloaded}/${CONFIG.globalFileLimit})`
              );
            }
          } catch (e) {
            continue;
          }
        }

        console.log(`\t> Cooldown: ${CONFIG.cooldownMs / 1000}s...`);
        await sleep(CONFIG.cooldownMs);
      } catch (err: any) {
        if (err.response && err.response.headers["x-ratelimit-reset"]) {
          const resetTimeMs =
            Number(err.response.headers["x-ratelimit-reset"]) * 1000;
          const EXTRA_TIME_THRESHOLD = 2000;
          const waitTime = resetTimeMs - Date.now() + EXTRA_TIME_THRESHOLD;
          console.log(
            `\t⚠️ Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`
          );
          await sleep(waitTime);
        } else {
          console.warn(`\t!!! Error at ${repo.full_name}: ${err.message}`);
        }
      }
    }

    fs.writeFileSync(
      "manifesto_tests.json",
      JSON.stringify(manifesto, null, 2)
    );
    console.log(
      `\nMining finished. ${totalDownloaded} files saved at ${CONFIG.outputDir}`
    );
  } catch (error: any) {
    console.error("!!! Fatal error:", error.message);
  }
}

mineTests();
