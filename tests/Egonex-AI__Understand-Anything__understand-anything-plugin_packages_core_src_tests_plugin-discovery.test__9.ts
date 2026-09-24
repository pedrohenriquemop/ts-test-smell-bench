import { describe, it, expect } from "vitest";
import {
  parsePluginConfig,
  serializePluginConfig,
  type PluginConfig,
  DEFAULT_PLUGIN_CONFIG,
} from "../plugins/discovery.js";


describe("plugin-discovery", () => {

  describe("serializePluginConfig", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("serializes plugin config to formatted JSON", () => {
          const config: PluginConfig = {
            plugins: [
              {
                name: "tree-sitter",
                enabled: true,
                languages: ["typescript", "javascript"],
              },
            ],
          };
          const json = serializePluginConfig(config);
          expect(json).toContain('"name": "tree-sitter"');
          expect(json).toContain('"enabled": true');
          expect(json).toContain('"languages"');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});