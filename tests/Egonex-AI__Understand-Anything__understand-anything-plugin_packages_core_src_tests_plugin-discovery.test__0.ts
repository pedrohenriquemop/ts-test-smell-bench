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
    it("parses valid config JSON", () => {
          const json = JSON.stringify({
            plugins: [
              { name: "tree-sitter", enabled: true, languages: ["typescript", "javascript"] },
              { name: "python-ast", enabled: false, languages: ["python"] },
            ],
          });
          const config = parsePluginConfig(json);
          expect(config.plugins).toHaveLength(2);
          expect(config.plugins[0].name).toBe("tree-sitter");
          expect(config.plugins[1].enabled).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});