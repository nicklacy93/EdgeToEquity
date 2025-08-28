'use client';
import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'edgebot';
  content: string;
  timestamp: Date;
  type: 'message' | 'coaching' | 'question' | 'celebration';
  confidence?: number;
  suggestedResponses?: string[];
}

export default function ChatMessageThread({ messages, onResponse }: {
  messages: ChatMessage[];
  onResponse: (msg: string) => void;
}) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex flex-col space-y-3 max-h-80 overflow-y-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={lex }>
          <div className={max-w-xs px-4 py-2 rounded-2xl }>
            <p className="text-sm">{msg.content}</p>

            {msg.sender === 'edgebot' && msg.confidence !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-0.5">
                  {[1,2,3].map(i => (
                    <div key={i} className={w-1 h-1 rounded-full } />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{Math.round(msg.confidence * 100)}%</span>
              </div>
            )}

            {msg.suggestedResponses && (
              <div className="flex flex-wrap gap-1 mt-2">
                {msg.suggestedResponses.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => onResponse(res)}
                    className="px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded-full transition-colors"
                  >
                    {res}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-slate-700 px-4 py-2 rounded-2xl">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
