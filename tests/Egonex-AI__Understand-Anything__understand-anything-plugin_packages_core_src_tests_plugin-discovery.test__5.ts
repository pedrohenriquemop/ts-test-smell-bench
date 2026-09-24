import { describe, it, expect } from "vitest";
import {
  parsePluginConfig,
  serializePluginConfig,
  type PluginConfig,
  DEFAULT_PLUGIN_CONFIG,
} from "../plugins/discovery.js";


describe("plugin-discovery", () => {

  describe("parsePluginConfig", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("returns default config when plugins field is not an array", () => {
          const json = JSON.stringify({
            plugins: "not an array",
          });
          const config = parsePluginConfig(json);
          expect(config).toEqual(DEFAULT_PLUGIN_CONFIG);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});