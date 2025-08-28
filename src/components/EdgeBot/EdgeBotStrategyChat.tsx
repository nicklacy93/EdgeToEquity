"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion/client";
import TypingBubble from "./TypingBubble";
import BookmarkIcon from "./BookmarkIcon";
import MoodBadge from "./MoodBadge";
import { useEmotionalState } from "@/hooks/useEmotionalState";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useChatMemory } from "@/hooks/useChatMemory";
import { sendToAI } from "@/utils/sendToAI";
import type { ChatMessage } from "@/types/ChatTypes";
import { useSessionContext } from "@/context/SessionContext";
import { useAuth } from "@/context/AuthContext";

interface StrategyContext {
    strategyType: string;
    generatedCode: string;
    selectedPlatform: 'pinescript' | 'ninjascript';
    userInput: string;
    confidence?: number;
}

interface EdgeBotStrategyChatProps {
    context: StrategyContext;
    fallback?: React.ComponentType;
}

function detectStrategyIntent(input: string): "strategy_explanation" | "code_analysis" | "improvement_suggestion" | "educational" | "general" {
    const lower = input.toLowerCase();

    // Strategy explanation patterns
    if (lower.includes("how does") || lower.includes("explain") || lower.includes("what is") ||
        lower.includes("how work") || lower.includes("tell me about")) {
        return "strategy_explanation";
    }

    // Code analysis patterns  
    if (lower.includes("code") || lower.includes("line") || lower.includes("function") ||
        lower.includes("variable") || lower.includes("parameter")) {
        return "code_analysis";
    }

    // Improvement suggestions
    if (lower.includes("improve") || lower.includes("better") || lower.includes("optimize") ||
        lower.includes("change") || lower.includes("modify") || lower.includes("conservative") ||
        lower.includes("aggressive")) {
        return "improvement_suggestion";
    }

    // Educational content
    if (lower.includes("learn") || lower.includes("teach") || lower.includes("tutorial") ||
        lower.includes("beginner") || lower.includes("understand")) {
        return "educational";
    }

    return "general";
}

export default function EdgeBotStrategyChat({ context, fallback: FallbackComponent }: EdgeBotStrategyChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState(false);

    const { toggleBookmark, isBookmarked } = useBookmarks();
    const { mood } = useEmotionalState();
    const containerRef = useRef<HTMLDivElement>(null);

    const { loadMemory, saveMemory } = useChatMemory();
    const { session } = useSessionContext();
    const { user } = useAuth();

    useEffect(() => {
        // Strategy-specific welcome message
        const generateWelcomeMessage = () => {
            let welcome = `Hi${user?.name ? ` ${user.name}` : ""}! 🤖 I'm EdgeBot, your AI strategy assistant.\n\n`;

            if (context.strategyType) {
                welcome += `I can see you've created a **${context.strategyType}** strategy! `;
                if (context.confidence) {
                    welcome += `I'm ${context.confidence}% confident this is a solid approach.\n\n`;
                }
            }

            welcome += `**I can help you:**\n`;
            welcome += `• 📚 Explain how your strategy works\n`;
            welcome += `• 🔍 Analyze specific parts of your code\n`;
            welcome += `• 💡 Suggest improvements and optimizations\n`;
            welcome += `• 🎓 Teach you about the indicators you're using\n\n`;
            welcome += `Ask me anything about your strategy - I'm here to help you learn! 🚀`;

            return welcome;
        };

        setMessages([
            {
                id: "strategy-welcome-bot",
                role: "bot",
                content: generateWelcomeMessage(),
            }
        ]);
    }, [context, user?.name]);

    useEffect(() => {
        saveMemory({ messages });
        containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, saveMemory]);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setLoading(true);
        setAiError(false);

        try {
            // Detect user intent
            const intent = detectStrategyIntent(input);

            // Prepare enhanced context for AI
            const enhancedPrompt = `
STRATEGY CONTEXT:
- Strategy Type: ${context.strategyType}
- Platform: ${context.selectedPlatform}
- User's Original Idea: ${context.userInput}
- Generated Code: ${context.generatedCode}
- User Intent: ${intent}

USER QUESTION: ${input}

INSTRUCTIONS: 
- You are EdgeBot, a friendly AI trading strategy assistant
- Provide helpful, educational responses about this specific strategy
- Reference the actual code when relevant
- Use emojis and conversational tone
- Keep responses concise but thorough
- If suggesting improvements, explain the reasoning
- Always be encouraging and supportive

RESPONSE:`;

            const response = await sendToAI(enhancedPrompt, "strategy");

            const reply: ChatMessage = {
                id: Date.now().toString() + "-bot",
                role: "bot",
                content: response.message || "I'm sorry, I couldn't process that request. Could you try rephrasing?",
                provider: response.provider,
            };

            setMessages((prev) => [...prev, reply]);
        } catch (error) {
            console.error("AI request failed:", error);
            setAiError(true);

            const errorReply: ChatMessage = {
                id: Date.now().toString() + "-bot",
                role: "bot",
                content: "I'm having trouble connecting to my AI brain right now 🤖💭 Could you try again in a moment?",
            };

            setMessages((prev) => [...prev, errorReply]);
        }

        setLoading(false);
    };

    // Fallback to static explainer if AI fails repeatedly
    if (aiError && FallbackComponent) {
        return (
            <div className="w-full">
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                        🤖 EdgeBot is taking a coffee break. Here's the classic explanation:
                    </p>
                </div>
                <FallbackComponent />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-h-[600px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-[hsl(var(--text-main))]">
                        🤖 Ask EdgeBot
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        Strategy Assistant
                    </span>
                </div>
                <MoodBadge mood={mood} />
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto space-y-4 p-4 bg-[hsl(var(--card-hsl))] text-[hsl(var(--text-main))] rounded-xl border border-[hsl(var(--border-hsl))]"
                style={{ minHeight: '300px', maxHeight: '400px' }}
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-xl max-w-[85%] whitespace-pre-wrap ${msg.role === "user"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-[hsl(var(--text-main))] self-end ml-auto"
                            : "bg-blue-500/10 border border-blue-500/20 text-[hsl(var(--text-main))] self-start mr-auto"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-[hsl(var(--text-muted))]">
                                {msg.role === "user" ? "👤 You" : "🤖 EdgeBot"}
                            </span>
                            {msg.role === "bot" && (
                                <BookmarkIcon
                                    bookmarked={isBookmarked(msg)}
                                    onClick={() => toggleBookmark(msg)}
                                />
                            )}
                        </div>
                        <div className="text-sm leading-relaxed">
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-start mr-auto"
                    >
                        <TypingBubble />
                    </motion.div>
                )}
            </div>

            <div className="mt-4 flex items-center gap-3">
                <input
                    className="flex-1 p-3 rounded-xl bg-[hsl(var(--background-hsl))] border border-[hsl(var(--border-hsl))] text-[hsl(var(--text-main))] placeholder-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="Ask me about your strategy..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    onClick={handleSubmit}
                >
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
} 
