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
    it("serializes config with options field", () => {
          const config: PluginConfig = {
            plugins: [
              {
                name: "custom-plugin",
                enabled: true,
                languages: ["python"],
                options: { strict: true, timeout: 5000 },
              },
            ],
          };
          const json = serializePluginConfig(config);
          expect(json).toContain('"options"');
          expect(json).toContain('"strict": true');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});