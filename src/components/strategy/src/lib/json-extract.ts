// src/lib/json-extract.ts
export function extractJson(input: unknown): any {
    // If it's already an object, accept it as-is
    if (input && typeof input === "object") return input;

    if (typeof input !== "string") {
        throw new Error(`LLM content is not a string (${typeof input})`);
    }

    let s = input.trim();

    // Prefer fenced ```json ... ``` or ``` ... ```
    let m = s.match(/```json([\s\S]*?)```/i) || s.match(/```([\s\S]*?)```/);
    if (m) s = m[1].trim();

    // Slice first {...} block if extra prose is present
    const start = s.indexOf("{");
    const end = s.lastIndexOf("}");
    const candidate = start >= 0 && end > start ? s.slice(start, end + 1) : s;

    // Guard against "[object Object]"
    if (candidate === "[object Object]") {
        throw new Error("LLM returned coerced object string ('[object Object]')");
    }

    return JSON.parse(candidate);
}
