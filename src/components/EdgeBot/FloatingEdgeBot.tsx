import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Maximize2, Minimize2, Sparkles } from "lucide-react";
import EdgeBotChat from "./EdgeBotChat";

export default function FloatingEdgeBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Floating Button - Enhanced */}
            {!isOpen && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-emerald-500/30 transition-all relative group focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                    aria-label="Open EdgeBot"
                >
                    {/* Pulsing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse opacity-50"></div>

                    {/* Main icon */}
                    <MessageSquare className="w-7 h-7 text-white relative z-10" />

                    {/* Notification badge with better styling */}
                    <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>

                    {/* Hover effect ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all"></div>
                </motion.button>
            )}

            {/* Enhanced Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`fixed ${expanded
                            ? "inset-4 max-w-none max-h-none"
                            : "bottom-24 right-8 w-[420px] h-[580px]"
                            } rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col z-50 overflow-hidden`}
                        style={{
                            background: "hsl(var(--card-bg-hsl))",
                            borderColor: "hsl(var(--border-hsl))",
                            boxShadow: expanded
                                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                : "0 20px 40px -8px rgba(0, 0, 0, 0.3)"
                        }}
                    >
                        {/* Enhanced Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm" style={{ borderColor: "hsl(var(--border-hsl))" }}>
                            <div className="flex items-center gap-3">
                                {/* Enhanced Avatar */}
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center relative overflow-hidden">
                                        <MessageSquare className="w-5 h-5 text-white" />

                                        {/* Animated border */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
                                    </div>

                                    {/* Online status indicator */}
                                    <motion.div
                                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </motion.div>
                                </div>

                                <div>
                                    <div className="font-semibold" style={{ color: "hsl(var(--text-main))" }}>
                                        EdgeBot Coach
                                    </div>
                                    <div className="text-xs text-emerald-300 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        Your learning companion • Online
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Control Buttons */}
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={() => setExpanded(!expanded)}
                                    className="p-2 rounded-lg transition-all hover:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500/30"
                                    style={{ color: "hsl(var(--text-main), 0.7)" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={expanded ? "Minimize" : "Expand"}
                                >
                                    {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </motion.button>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg transition-all hover:bg-red-500/20 hover:text-red-400 focus:ring-2 focus:ring-red-500/30"
                                    style={{ color: "hsl(var(--text-main), 0.7)" }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Close EdgeBot"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Chat Interface */}
                        <div className="flex-1 overflow-hidden">
                            <EdgeBotChat />
                        </div>

                        {/* Optional: Status bar at bottom for expanded mode */}
                        {expanded && (
                            <motion.div
                                className="px-4 py-2 border-t bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm"
                                style={{ borderColor: "hsl(var(--border-hsl))" }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center justify-between text-xs" style={{ color: "hsl(var(--text-main), 0.6)" }}>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        AI-powered trading coach
                                    </span>
                                    <span>Press Esc to close</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard shortcut handler for expanded mode */}
            {isOpen && expanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                    onClick={() => setExpanded(false)}
                />
            )}
        </div>
    );
}
