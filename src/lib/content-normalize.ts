// src/lib/content-normalize.ts
// Converts OpenAI chat message content into a best-effort string.
// Handles strings, arrays of parts, or arbitrary objects.
export function contentToString(content: unknown): string {
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        // e.g., multimodal parts; join text-like pieces
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part && typeof part === "object") {
                    // Try common shapes: { text }, { type, text }, etc.
                    // As a last resort, stringify the chunk.
                    const anyPart: any = part;
                    if (typeof anyPart.text === "string") return anyPart.text;
                    if (typeof anyPart.content === "string") return anyPart.content;
                    return JSON.stringify(anyPart);
                }
                return String(part);
            })
            .join("\n");
    }

    if (content && typeof content === "object") {
        // Some SDKs may wrap content in objects; prefer known fields.
        const anyObj: any = content;
        if (typeof anyObj.text === "string") return anyObj.text;
        if (typeof anyObj.content === "string") return anyObj.content;
        return JSON.stringify(anyObj);
    }

    return String(content ?? "");
}

