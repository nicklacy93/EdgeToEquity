// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock responses based on keywords
    let response = "I'm a mock AI assistant. ";
    let agent = 'strategy_generator';
    const model = 'mock-gpt-4'; // Changed to const since it never gets reassigned
    
    if (message.toLowerCase().includes('strategy')) {
      response += "Here's a basic trading strategy concept: Consider using RSI divergence with support/resistance levels for entry points.";
      agent = 'strategy_generator';
    } else if (message.toLowerCase().includes('psychology')) {
      response += "Trading psychology is crucial! Focus on discipline, risk management, and emotional control. Keep a trading journal to track your mindset.";
      agent = 'psychology_analyzer';
    } else if (message.toLowerCase().includes('rsi') || message.toLowerCase().includes('divergence')) {
      response += "RSI divergence occurs when price makes new highs/lows but RSI doesn't confirm. This can signal potential reversals.";
      agent = 'strategy_explainer';
    } else if (message.toLowerCase().includes('debug') || message.toLowerCase().includes('pine')) {
      response += "For Pine Script debugging, check your syntax, ensure proper indentation, and verify variable declarations. What specific error are you seeing?";
      agent = 'ai_debugger';
    } else {
      response += `You asked: "${message}". This is a mock response. In production, this would connect to your actual AI service.`;
    }
    
    return NextResponse.json({
      data: {
        response,
        agent_used: agent,
        model_used: model,
        confidence_score: Math.random() * 0.3 + 0.7 // Random confidence between 0.7-1.0
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
