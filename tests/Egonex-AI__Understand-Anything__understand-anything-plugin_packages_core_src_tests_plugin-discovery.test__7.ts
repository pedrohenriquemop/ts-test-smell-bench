import { describe, it, expect } from "vitest";
import {
  parsePluginConfig,
  serializePluginConfig,
  type PluginConfig,
  DEFAULT_PLUGIN_CONFIG,
} from "../plugins/discovery.js";


describe("plugin-discovery", () => {

  describe("DEFAULT_PLUGIN_CONFIG", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("includes tree-sitter as enabled by default", () => {
          expect(DEFAULT_PLUGIN_CONFIG.plugins).toHaveLength(1);
          expect(DEFAULT_PLUGIN_CONFIG.plugins[0].name).toBe("tree-sitter");
          expect(DEFAULT_PLUGIN_CONFIG.plugins[0].enabled).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});