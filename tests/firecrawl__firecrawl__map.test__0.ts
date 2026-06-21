it.concurrent(
    "handles query parameters correctly",
    async () => {
      let response = await map(
        {
          url: "https://www.hfea.gov.uk",
          sitemapOnly: true,
          useMock: "map-query-params",
          ignoreQueryParameters: false,
        },
        identity,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(
        response.body.links.some(x =>
          x.match(
            /^https:\/\/www\.hfea\.gov\.uk\/choose-a-clinic\/clinic-search\/results\/?\?options=\d+$/,
          ),
        ),
      ).toBe(true);
    },
    60000,
  )