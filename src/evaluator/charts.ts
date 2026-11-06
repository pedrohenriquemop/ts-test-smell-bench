import * as fs from "fs";
import * as path from "path";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { ChartConfiguration } from "chart.js";
import type { Metric } from "./metrics.ts";

/** Grayscale bar and radar charts, sized and styled for print. */
export async function generatePngCharts(
  metrics: Metric[],
  outputDir: string,
  versionSuffix: string = "",
) {
  const width = 1200;
  const height = 800;
  const backgroundColour = "white";
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour,
  });

  const labels = metrics.map((m) => m.smell);
  const precision = metrics.map((m) => m.precision);
  const recall = metrics.map((m) => m.recall);
  const f1 = metrics.map((m) => m.f1);

  const fontOptions = {
    family: "'Times New Roman', Times, serif",
    size: 16,
  };

  const barConfig: ChartConfiguration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Precision",
          data: precision,
          backgroundColor: "#444444",
          borderColor: "#000000",
          borderWidth: 1,
        },
        {
          label: "Recall",
          data: recall,
          backgroundColor: "#888888",
          borderColor: "#000000",
          borderWidth: 1,
        },
        {
          label: "F1-Score",
          data: f1,
          backgroundColor: "#cccccc",
          borderColor: "#000000",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: { labels: { font: fontOptions, color: "#000000" } },
        title: {
          display: true,
          text: "Metrics Overview (P/R/F1)",
          font: { ...fontOptions, size: 24, weight: "bold" },
          color: "#000000",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: { font: fontOptions, color: "#000000" },
          grid: { color: "#e0e0e0" },
          title: {
            display: true,
            text: "Score",
            font: fontOptions,
            color: "#000000",
          },
        },
        x: {
          ticks: { font: fontOptions, color: "#000000" },
          grid: { display: false },
          title: {
            display: true,
            text: "Test Smell Type",
            font: fontOptions,
            color: "#000000",
          },
        },
      },
    },
  };

  const radarConfig: ChartConfiguration = {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "F1-Score",
          data: f1,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderColor: "#000000",
          pointBackgroundColor: "#000000",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "F1-Score Distribution",
          font: { ...fontOptions, size: 24, weight: "bold" },
          color: "#000000",
        },
      },
      scales: {
        r: {
          min: 0,
          max: 1,
          angleLines: { color: "#cccccc" },
          grid: { color: "#cccccc" },
          pointLabels: { font: fontOptions, color: "#000000" },
          ticks: {
            backdropColor: "transparent",
            font: fontOptions,
            color: "#000000",
          },
        },
      },
    },
  };

  const barBuffer = await chartJSNodeCanvas.renderToBuffer(barConfig);
  fs.writeFileSync(
    path.join(outputDir, `metrics_bar_chart${versionSuffix}.png`),
    barBuffer,
  );
  console.log(
    `Saved PNG chart to ${path.join(outputDir, `metrics_bar_chart${versionSuffix}.png`)}`,
  );

  const radarBuffer = await chartJSNodeCanvas.renderToBuffer(radarConfig);
  fs.writeFileSync(
    path.join(outputDir, `metrics_radar_chart${versionSuffix}.png`),
    radarBuffer,
  );
  console.log(
    `Saved PNG chart to ${path.join(outputDir, `metrics_radar_chart${versionSuffix}.png`)}`,
  );
}
