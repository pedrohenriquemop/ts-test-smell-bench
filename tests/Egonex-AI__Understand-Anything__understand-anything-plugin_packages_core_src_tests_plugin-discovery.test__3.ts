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
    it("filters out entries missing required fields", () => {
          const json = JSON.stringify({
            plugins: [
              { name: "valid", enabled: true, languages: ["typescript"] },
              { enabled: true, languages: ["python"] }, // missing name
              { name: "no-langs", enabled: true }, // missing languages
            ],
          });
          const config = parsePluginConfig(json);
          expect(config.plugins).toHaveLength(1);
          expect(config.plugins[0].name).toBe("valid");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});