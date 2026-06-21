test("Empty list of meta-data", () => {
      expect(
        getEffectiveFinalMetaData([], environmentVariables)
      ).toSubsetEqualRight([]);
    })