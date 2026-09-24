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
    it("defaults enabled to true when omitted", () => {
          const json = JSON.stringify({
            plugins: [
              { name: "tree-sitter", languages: ["typescript"] },
            ],
          });
          const config = parsePluginConfig(json);
          expect(config.plugins[0].enabled).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});