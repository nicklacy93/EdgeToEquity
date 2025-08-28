"use client";

import { exportToJSON, exportToMarkdown } from "@/utils/exportSession";
import { Download } from "lucide-react";

interface Props {
  messages: any[];
}

export default function ExportDropdown({ messages }: Props) {
  return (
    <div className="relative text-sm text-white">
      <button className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg hover:bg-muted/80">
        <Download size={14} /> Export
      </button>
      <div className="absolute top-full mt-2 left-0 bg-popover border rounded-lg shadow-md z-10 w-40">
        <button
          onClick={() => exportToJSON(messages)}
          className="block w-full text-left px-3 py-2 hover:bg-muted text-xs"
        >
          ?? Export as JSON
        </button>
        <button
          onClick={() => exportToMarkdown(messages)}
          className="block w-full text-left px-3 py-2 hover:bg-muted text-xs"
        >
          ?? Export as Markdown
        </button>
      </div>
    </div>
  );
}
