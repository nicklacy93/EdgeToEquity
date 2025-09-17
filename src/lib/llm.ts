import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export function getOpenAI() {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key.trim().length < 20) {
        throw new Error('Missing OPENAI_API_KEY');
    }
    return new OpenAI({ apiKey: key });
}

export async function jsonOnly(
    model: string,
    system: string,
    user: string
): Promise<any> {
    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("No response content from OpenAI");
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        // Single retry on parse failure
        const retryResponse = await openai.chat.completions.create({
            model,
            messages: [
                { role: "system", content: system + "\n\nIMPORTANT: Respond ONLY with valid JSON." },
                { role: "user", content: user },
            ],
            response_format: { type: "json_object" },
            temperature: 0.05,
        });

        const retryContent = retryResponse.choices[0]?.message?.content;
        if (!retryContent) {
            throw new Error("No response content from OpenAI retry");
        }

        return JSON.parse(retryContent);
    }
}

export const SYS_ARCHITECT = `You are a trading strategy architect. Create comprehensive trading strategies based on user briefs.

Rules:
- Always return valid JSON matching the StrategySpec schema
- Include appropriate technical indicators for the strategy type
- Add realistic entry/exit rules with proper conditions
- Set reasonable risk parameters
- Use clear, descriptive names and conditions
- Ensure all required fields are present
- Set meta.updatedBy to "architect"`;

export const SYS_DOCTOR = `You are a trading strategy doctor. Analyze and improve existing strategies based on user instructions.

Rules:
- Always return valid JSON matching the StrategySpec schema
- Preserve the original strategy structure when possible
- Apply changes incrementally based on user instructions
- Increment the revision number
- Update meta.updatedAt and meta.updatedBy to "doctor"
- Maintain consistency with existing indicators and rules
- Ensure all changes are logically sound`;
