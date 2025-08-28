'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  provider?: 'openai' | 'claude';
  cost?: number;
  processingTime?: number;
}

interface UserStats {
  totalCost: number;
  requestCount: number;
  conversationsRemaining: number;
}

export function EnhancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Welcome to EdgeToEquity! I'm EdgeBot, your AI trading assistant powered by dual-AI technology.\n\n🎯 **Smart AI Routing:**\n• **Technical Analysis & Strategy** → OpenAI GPT-4o-mini\n• **Psychology & Education** → Claude 3.5 Sonnet\n\nI automatically route your questions to the best AI for optimal responses. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [requestType, setRequestType] = useState<'technical' | 'psychology' | 'education' | 'general'>('general');
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userId,
          requestType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
        provider: data.provider,
        cost: data.cost,
        processingTime: data.processingTime,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update user stats
      if (data.userStats) {
        setUserStats({
          totalCost: data.userStats.totalCost,
          requestCount: data.userStats.requestCount,
          conversationsRemaining: 10 - data.userStats.requestCount,
        });
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getProviderBadge = (provider?: 'openai' | 'claude') => {
    if (!provider) return null;
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${
          provider === 'openai' ? 'border-blue-500 text-blue-700' : 'border-purple-500 text-purple-700'
        }`}
      >
        {provider === 'openai' ? '🔧 OpenAI' : '🧠 Claude'}
      </Badge>
    );
  };

  const getRequestTypeDescription = (type: string) => {
    switch (type) {
      case 'technical': return '📊 Technical Analysis & Strategy';
      case 'psychology': return '🧠 Psychology & Mindset Coaching';
      case 'education': return '📚 Educational Content';
      default: return '💬 General Trading Discussion';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Header with Stats */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">EdgeBot AI Assistant</h1>
              <p className="text-muted-foreground">Dual-AI powered trading insights</p>
            </div>
            {userStats && (
              <Card className="p-4">
                <div className="text-sm space-y-1">
                  <div>Conversations: {userStats.requestCount}/10</div>
                  <div>Cost: ${userStats.totalCost.toFixed(4)}</div>
                  <div>Remaining: {userStats.conversationsRemaining}</div>
                </div>
              </Card>
            )}
          </div>

          {/* Request Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Type (Smart Routing)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['technical', 'psychology', 'education', 'general'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={requestType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRequestType(type)}
                    className="text-xs"
                  >
                    {getRequestTypeDescription(type)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                The system will automatically route your question to the best AI: 
                Technical/Strategy → OpenAI | Psychology/Education → Claude
              </p>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with EdgeBot</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {/* AI Provider Badge */}
                      {message.sender === 'ai' && message.provider && (
                        <div className="flex justify-between items-center mb-2">
                          {getProviderBadge(message.provider)}
                          {message.cost && (
                            <span className="text-xs text-gray-500">
                              ${message.cost.toFixed(6)} • {message.processingTime}ms
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Message Text */}
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      
                      {/* Timestamp */}
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about trading strategies, psychology, market analysis..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
