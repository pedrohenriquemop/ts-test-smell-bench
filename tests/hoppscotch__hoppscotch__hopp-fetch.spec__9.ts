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

  describe("Standard fetch patterns", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("should handle init options with string URL", async () => {
          const hoppFetch = createHoppFetchHook()

          await hoppFetch("https://api.example.com/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: true }),
          })

          expect(mockAxiosInstance).toHaveBeenCalledWith(
            expect.objectContaining({
              url: "https://api.example.com/data",
              method: "POST",
              headers: expect.objectContaining({
                "Content-Type": "application/json",
              }),
              data: JSON.stringify({ test: true }),
            })
          )
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});