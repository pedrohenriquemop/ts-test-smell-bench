test("Non-empty active list of meta-data with unavailable ENV", () => {
      expect(
        getEffectiveFinalMetaData(
          [
            {
              active: true,
              key: "<<UNKNOWN_KEY>>",
              value: "<<UNKNOWN_VALUE>>",
              description: "",
            },
          ],
          environmentVariables
        )
      ).toSubsetEqualRight([{ active: true, key: "", value: "" }]);
    })