it("should return response with correct status and statusText", async () => {
      const hoppFetch = createHoppFetchHook()

      mockAxiosInstance.mockResolvedValue({
        status: 201,
        statusText: "Created",
        headers: {},
        data: new ArrayBuffer(0),
      })

      const response = await hoppFetch("https://api.example.com/data")

      expect(response.status).toBe(201)
      expect(response.statusText).toBe("Created")
    })