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
    it("includes Swift now that a tree-sitter grammar is available", () => {
          expect(DEFAULT_PLUGIN_CONFIG.plugins[0].languages).toContain("swift");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});