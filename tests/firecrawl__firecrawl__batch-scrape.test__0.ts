it.concurrent(
      "works",
      async () => {
        const response = await batchScrape(
          {
            urls: [TEST_SUITE_WEBSITE],
            formats: [
              {
                type: "json",
                prompt:
                  "Based on the information on the page, find what the company's mission is and whether it supports SSO, and whether it is open source.",
                schema: {
                  type: "object",
                  properties: {
                    company_mission: {
                      type: "string",
                    },
                    supports_sso: {
                      type: "boolean",
                    },
                    is_open_source: {
                      type: "boolean",
                    },
                  },
                  required: [
                    "company_mission",
                    "supports_sso",
                    "is_open_source",
                  ],
                },
              },
            ],
          },
          identity,
        );

        expect(response.data[0]).toHaveProperty("json");
        expect(response.data[0].json).toHaveProperty("company_mission");
        expect(typeof response.data[0].json.company_mission).toBe("string");
        expect(response.data[0].json).toHaveProperty("supports_sso");
        expect(response.data[0].json.supports_sso).toBe(false);
        expect(typeof response.data[0].json.supports_sso).toBe("boolean");
        expect(response.data[0].json).toHaveProperty("is_open_source");
        expect(response.data[0].json.is_open_source).toBe(true);
        expect(typeof response.data[0].json.is_open_source).toBe("boolean");
      },
      180000,
    )