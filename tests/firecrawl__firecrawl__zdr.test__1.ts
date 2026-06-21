it(
      "should clean up a crawl",
      async () => {
        const preLogs = await getLogs();

        let identity = await idmux({
          name: `zdr/${scope}/crawl`,
          credits: 10000,
          flags: {
            scrapeZDR: scope === "Team-scoped" ? "forced" : "allowed",
          },
        });

        const crawl1 = await crawl(
          {
            url: "https://firecrawl.dev",
            limit: 10,
            zeroDataRetention: scope === "Request-scoped" ? true : undefined,
          },
          identity,
        );

        await new Promise(resolve => setTimeout(resolve, 2500));

        const postLogs = (await getLogs()).slice(preLogs.length);

        if (postLogs.length > 0) {
          console.warn("Logs changed during crawl", postLogs);
        }

        expect(postLogs).toHaveLength(0);

        // wait 20 seconds for crawl finish cron to fire
        await new Promise(resolve => setTimeout(resolve, 20000));

        await expectCrawlIsCleanedUp(crawl1.id);

        const scrapes = await expectScrapesOfRequestAreCleanedUp(crawl1.id);

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