test("Promise rejects with the code `UNKNOWN_ERROR` while encountering an error that is not an instance of `AxiosError`", () => {
        const expected = {
          code: "UNKNOWN_ERROR",
          data: new Error("UNKNOWN_ERROR"),
        };

        vi.spyOn(axios, "get").mockImplementation(() =>
          Promise.reject(new Error("UNKNOWN_ERROR"))
        );

        expect(getResourceContents(args)).rejects.toEqual(expected);
      })