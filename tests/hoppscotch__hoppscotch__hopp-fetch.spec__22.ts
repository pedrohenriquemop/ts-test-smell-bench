it("should handle Set-Cookie headers as array", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {
          "set-cookie": ["session=abc123", "token=xyz789"],
        },
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.headers.getSetCookie()).toEqual([
        "session=abc123",
        "token=xyz789",
      ])
    })