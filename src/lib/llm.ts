import OpenAI from "openai";
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function jsonOnly(model: string, system: string, user: string) {
  const res = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return res.choices[0]?.message?.content ?? "{}";
}

export const SYS_ARCHITECT = `You are Strategy Architect.
Output MUST be a single JSON object conforming to the provided StrategySpec schema.
No prose, no comments, no code fences.`;

export const SYS_DOCTOR = `You are Strategy Doctor.
Improve, simplify, or fix the StrategySpec.
Return either:
- a JSON Patch (RFC6902) array, OR
- a full StrategySpec JSON
No prose or code fences; JSON only.`;
