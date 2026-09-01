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
    it("should throw error for non-Error exceptions", async () => {
          const hoppFetch = createHoppFetchHook()

          mockAxiosInstance.mockRejectedValue("String error")
          mockIsAxiosError.mockReturnValue(false)

          await expect(hoppFetch("https://api.example.com/data")).rejects.toThrow(
            "Fetch failed: Unknown error"
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});