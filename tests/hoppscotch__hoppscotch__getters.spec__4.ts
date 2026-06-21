test("Promise rejects with the code `INVALID_SERVER_URL` if the network call succeeds and the received response content type is not `application/json`", () => {
        const expected = {
          code: "INVALID_SERVER_URL",
          data: args.serverUrl,
        };

        vi.spyOn(axios, "get").mockImplementation(() =>
          Promise.resolve({
            data: "",
            headers: { "content-type": "text/html; charset=UTF-8" },
          })
        );

        expect(getResourceContents(args)).rejects.toEqual(expected);
      })