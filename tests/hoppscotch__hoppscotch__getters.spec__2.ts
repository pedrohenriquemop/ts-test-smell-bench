test("Inactive list of meta-data", () => {
      expect(
        getEffectiveFinalMetaData(
          [{ active: false, key: "KEY", value: "<<PARAM>>", description: "" }],
          environmentVariables
        )
      ).toSubsetEqualRight([]);
    })