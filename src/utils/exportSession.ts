export function exportToJSON(data: any, filename = "edgebot-session.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function exportToMarkdown(messages: any[], filename = "edgebot-session.md") {
  const markdown = messages
    .map((msg: any) => {
      const sender = msg.sender === "user" ? "?? Trader" : "?? EdgeBot";
      return `### ${sender}\n${msg.content}\n`;
    })
    .join("\n");

  const blob = new Blob([markdown], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

import { generateMarkdownSummary, SessionExportData } from "./generateMarkdownSummary";

export function exportClaudeMarkdown(data: SessionExportData, filename = "edgebot-session.md") {
  const markdown = generateMarkdownSummary(data);
  const blob = new Blob([markdown], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
