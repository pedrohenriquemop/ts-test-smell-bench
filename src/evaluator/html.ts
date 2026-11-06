import type { Interval } from "./metrics.ts";

export const LOW_SUPPORT = 10;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
export const ci = ([lo, hi]: Interval) => `${(lo * 100).toFixed(1)}–${(hi * 100).toFixed(1)}`;

/** 0 → red, 1 → green; used to tint score cells. */
export function scoreColor(value: number): string {
  return `hsla(${Math.round(value * 120)}, 70%, 40%, 0.35)`;
}

export interface Column {
  label: string;
  align?: "left" | "right";
  title?: string;
}

/** Cells are raw HTML; escape user-facing text before passing it in. */
export function table(columns: Column[], rows: string[][], caption?: string): string {
  const head = columns
    .map((c) => {
      const align = c.align === "left" ? "text-left" : "text-right";
      const title = c.title ? ` title="${escapeHtml(c.title)}"` : "";
      return `<th class="py-3 px-3 font-semibold uppercase tracking-wider text-xs ${align}"${title}>${escapeHtml(c.label)}</th>`;
    })
    .join("");
  const body = rows
    .map(
      (row) =>
        `<tr class="hover:bg-white/5">${row
          .map((cell, i) => {
            const align = columns[i]?.align === "left" ? "text-left" : "text-right whitespace-nowrap";
            return `<td class="py-2 px-3 ${align} text-gray-200 align-top">${cell}</td>`;
          })
          .join("")}</tr>`,
    )
    .join("");
  return `<div class="overflow-x-auto">
  ${caption ? `<p class="text-sm text-gray-400 mb-3">${caption}</p>` : ""}
  <table class="w-full border-collapse text-sm">
    <thead><tr class="border-b border-gray-700 text-gray-400">${head}</tr></thead>
    <tbody class="divide-y divide-gray-800">${body}</tbody>
  </table>
</div>`;
}

export function section(title: string, content: string): string {
  return `<section class="glass-panel p-6 shadow-xl">
  <h2 class="text-2xl font-bold mb-4 text-white">${escapeHtml(title)}</h2>
  ${content}
</section>`;
}

export function statCards(cards: Array<{ label: string; value: string; hint?: string }>): string {
  return `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">${cards
    .map(
      (c) => `<div class="glass-panel p-4">
    <div class="text-xs uppercase tracking-wider text-gray-400">${escapeHtml(c.label)}</div>
    <div class="text-2xl font-bold text-white mt-1">${c.value}</div>
    ${c.hint ? `<div class="text-xs text-gray-500 mt-1">${c.hint}</div>` : ""}
  </div>`,
    )
    .join("")}</div>`;
}

export const badge = (text: string, color = "amber") =>
  `<span class="ml-2 px-2 py-0.5 rounded-full text-xs bg-${color}-500/20 text-${color}-300">${escapeHtml(text)}</span>`;

export function page(title: string, subtitle: string, body: string, scripts = ""): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    .glass-panel { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; }
  </style>
</head>
<body class="p-8">
  <div class="max-w-7xl mx-auto space-y-8">
    <header class="text-center py-8 glass-panel">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500 mb-3">${escapeHtml(title)}</h1>
      <p class="text-lg text-gray-400">${subtitle}</p>
    </header>
    ${body}
  </div>
  ${scripts}
</body>
</html>`;
}
