it("should handle single Set-Cookie header as string", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: {
          "set-cookie": "session=abc123",
        },
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.headers.getSetCookie()).toEqual(["session=abc123"])
    })