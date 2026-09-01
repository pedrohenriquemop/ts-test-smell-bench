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

  describe("Edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("should handle Request with no headers", async () => {
          const hoppFetch = createHoppFetchHook()

          const request = new Request("https://api.example.com/data")

          await hoppFetch(request)

          expect(mockAxiosInstance).toHaveBeenCalledWith(
            expect.objectContaining({
              headers: {},
            })
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});