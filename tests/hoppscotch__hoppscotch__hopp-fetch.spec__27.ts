import { describe, expect, it, vi, beforeEach } from "vitest"
import { createHoppFetchHook } from "../../utils/hopp-fetch"
import axios from "axios"

const mockAxios = axios as any
const mockIsAxiosError = mockAxios.isAxiosError as ReturnType<typeof vi.fn>
const mockAxiosInstance = vi.fn()

describe("CLI hopp-fetch", () => {
  beforeEach(() => {
      vi.clearAllMocks()

      // Set up axios.create to return our mockAxiosInstance
      mockAxios.create.mockReturnValue(mockAxiosInstance)

      // Default successful response
      mockAxiosInstance.mockResolvedValue({
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
        data: new ArrayBuffer(0),
      })

      // Reset isAxiosError mock
      mockIsAxiosError.mockReturnValue(false)
    })

  describe("Error handling", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("should handle axios error with response", async () => {
          const hoppFetch = createHoppFetchHook()

          const errorResponse = {
            status: 500,
            statusText: "Internal Server Error",
            headers: {},
            data: new ArrayBuffer(0),
          }

          mockAxiosInstance.mockRejectedValue({
            response: errorResponse,
            isAxiosError: true,
          })
          mockIsAxiosError.mockReturnValue(true)

          const response = await hoppFetch("https://api.example.com/data")

          expect(response.status).toBe(500)
          expect(response.statusText).toBe("Internal Server Error")
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});