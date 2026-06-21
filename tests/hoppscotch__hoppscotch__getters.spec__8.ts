test("Filters request variables by active status and value fields, then remove environment variables sharing the same keys", () => {
      const expected = [
        {
          key: "SHARED_KEY_I",
          currentValue: "request-variable-shared-value-I",
          initialValue: "request-variable-shared-value-I",
          secret: false,
        },
        {
          key: "REQUEST_VAR_III",
          currentValue: "request-variable-value-III",
          initialValue: "request-variable-value-III",
          secret: false,
        },
        {
          key: "SHARED_KEY_II",
          currentValue: "environment-variable-shared-value-II",
          initialValue: "environment-variable-shared-value-II",
          secret: false,
        },
        {
          key: "ENV_VAR_III",
          currentValue: "environment-variable-value-III",
          initialValue: "environment-variable-value-III",
          secret: false,
        },
        {
          key: "ENV_VAR_IV",
          currentValue: "environment-variable-value-IV",
          initialValue: "environment-variable-value-IV",
          secret: false,
        },
        {
          key: "ENV_VAR_V",
          currentValue: "environment-variable-value-V",
          initialValue: "environment-variable-value-V",
          secret: false,
        },
      ];

      expect(
        getResolvedVariables(requestVariables, environmentVariables)
      ).toEqual(expected);
    })