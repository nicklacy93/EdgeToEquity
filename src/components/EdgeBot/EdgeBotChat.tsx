"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

function detectAgent(input: string): "strategy" | "debug" | "psychology" | "news" | "general" {
    const lower = input.toLowerCase();
    if (lower.includes("code") || lower.includes("error") || lower.includes("script")) return "debug";
    if (lower.includes("emotion") || lower.includes("mood") || lower.includes("psychology") || lower.includes("feeling")) return "psychology";
    if (lower.includes("news") || lower.includes("macro")) return "news";
    if (lower.includes("strategy") || lower.includes("trade") || lower.includes("entry")) return "strategy";
    return "general";
}

export default function EdgeBotChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const { toggleBookmark, isBookmarked } = useBookmarks();
    const { mood } = useEmotionalState();
    const containerRef = useRef<HTMLDivElement>(null);

    const { loadMemory, saveMemory } = useChatMemory();
    const { session } = useSessionContext();
    const { user } = useAuth();

    useEffect(() => {
        const memory = loadMemory();
        if (memory?.messages && memory.messages.length > 0) {
            setMessages(memory.messages);
        } else {
            // Personalized welcome message
            let welcome = `Hi${user?.name ? ` ${user.name}` : ""}! ?? I'm EdgeBot, your personal trading coach.`;
            if (session.learningStreak) {
                welcome += `\nYou're on a ${session.learningStreak}-day learning streak!`;
            }
            if (session.strategiesBuilt) {
                welcome += `\nYou've built ${session.strategiesBuilt} strategies so far.`;
            }
            if (session.journalEntries) {
                welcome += `\nYou've made ${session.journalEntries} journal entries.`;
            }
            welcome += `\n\nAsk me anything about trading, psychology, or your progress�or just say hi!`;
            setMessages([
                {
                    id: "welcome-bot",
                    role: "bot",
                    content: welcome,
                }
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        saveMemory({ messages });
        containerRef.current?.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

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

        // Auto-detect agent
        const agent = detectAgent(input);

        const response = await sendToAI(input, agent);

        const reply: ChatMessage = {
            id: Date.now().toString() + "-bot",
            role: "bot",
            content: response.message || "(No response)",
            provider: response.provider,
        };

        setMessages((prev) => [...prev, reply]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-[hsl(var(--text-main))] text-base">Chat with EdgeBot</div>
                <MoodBadge mood={mood} />
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto space-y-4 p-2 bg-[hsl(var(--card-hsl))] text-[hsl(var(--text-main))] rounded"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap font-semibold ${msg.role === "user"
                            ? "bg-blue-200 dark:bg-blue-800 text-[hsl(var(--text-main))] dark:text-white self-end ml-auto"
                            : "bg-green-200 dark:bg-green-800 text-[hsl(var(--text-main))] dark:text-white self-start mr-auto"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">
                                {msg.role === "user" ? "You" : "EdgeBot"}
                            </span>
                            {msg.role === "bot" && (
                                <BookmarkIcon
                                    bookmarked={isBookmarked(msg)}
                                    onClick={() => toggleBookmark(msg)}
                                />
                            )}
                        </div>
                        {msg.content}
                    </motion.div>
                ))}
                {loading && <TypingBubble />}
            </div>

            <div className="mt-3 flex items-center gap-2">
                <input
                    className="flex-1 p-2 rounded bg-[hsl(var(--background-hsl))] text-[hsl(var(--text-main))] placeholder-gray-400 focus:outline-none"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-4 py-2 rounded bg-[hsl(var(--primary-hsl))] text-[hsl(var(--text-main))] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
