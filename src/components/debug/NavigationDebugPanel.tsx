"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bug, X, RefreshCw, AlertTriangle } from 'lucide-react';

export default function NavigationDebugPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState('');
    const pathname = usePathname();
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentPath(pathname);
        addLog(`Path changed to: ${pathname}`);
    }, [pathname]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    };

    const clearLogs = () => {
        setLogs([]);
        addLog('Logs cleared');
    };

    const refreshPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logs]);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <>
            {/* Debug Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
            >
                <Bug size={20} />
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
                    <div className="flex items-center justify-between p-3 border-b border-slate-700">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-400" />
                            Navigation Debug
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={refreshPage}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                                title="Refresh Page"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="p-3 space-y-3">
                        {/* Current Path */}
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">
                                Current Path:
                            </label>
                            <div className="text-sm text-white font-mono bg-slate-800 p-2 rounded">
                                {currentPath}
                            </div>
                        </div>

                        {/* Logs */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-slate-400">
                                    Debug Logs:
                                </label>
                                <button
                                    onClick={clearLogs}
                                    className="text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div
                                ref={logRef}
                                className="h-32 overflow-y-auto bg-slate-800 p-2 rounded text-xs text-slate-300 font-mono"
                            >
                                {logs.length === 0 ? (
                                    <div className="text-slate-500">No logs yet...</div>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} className="mb-1">
                                            {log}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <label className="text-xs text-slate-400 block mb-2">
                                Quick Actions:
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => addLog('Manual log entry')}
                                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                >
                                    Add Log
                                </button>
                                <button
                                    onClick={() => {
                                        addLog(`User Agent: ${navigator.userAgent}`);
                                    }}
                                    className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                >
                                    User Agent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}