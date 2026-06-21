it(
      "should clean up a batch scrape",
      async () => {
        const preLogs = await getLogs();

        let identity = await idmux({
          name: `zdr/${scope}/batch-scrape`,
          credits: 10000,
          flags: {
            scrapeZDR: scope === "Team-scoped" ? "forced" : "allowed",
          },
        });

        const crawl1 = await batchScrape(
          {
            urls: ["https://firecrawl.dev", "https://mendable.ai"],
            zeroDataRetention: scope === "Request-scoped" ? true : undefined,
          },
          identity,
        );

        await new Promise(resolve => setTimeout(resolve, 2500));

        const postLogs = (await getLogs()).slice(preLogs.length);

        if (postLogs.length > 0) {
          console.warn("Logs changed during batch scrape", postLogs);
        }

        expect(postLogs).toHaveLength(0);

        // wait 20 seconds for batch scrape finish cron to fire
        await new Promise(resolve => setTimeout(resolve, 20000));

        await expectBatchScrapeIsCleanedUp(crawl1.id);

        const scrapes = await expectScrapesOfRequestAreCleanedUp(crawl1.id, 2);

        await zdrcleaner(identity.teamId!);

        await expectScrapesAreFullyCleanedAfterZDRCleaner(
          scrapes,
          scope,
          identity,
          scrapeStatusRaw,
        );
      },
      600000 + 20000,
    )