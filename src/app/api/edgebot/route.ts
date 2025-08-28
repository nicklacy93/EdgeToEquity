// API Route for OpenAI EdgeBot Integration
import { NextRequest, NextResponse } from 'next/server';
import EdgeBotOpenAI from '@/lib/openai/EdgeBotOpenAI';

export async function POST(request: NextRequest) {
  try {
    const { message, context, action } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const edgeBot = new EdgeBotOpenAI();

    let response: string;

    switch (action) {
      case 'chat':
        response = await edgeBot.generateResponse(message, context || {
          userExperience: 'intermediate',
          tradingStyle: [],
          preferredMarkets: [],
          riskTolerance: 'moderate',
          conversationHistory: []
        });
        break;

      case 'generate_code':
        response = await edgeBot.generateStrategyCode(message, context?.platform || 'pinescript');
        break;

      case 'analyze_file':
        response = await edgeBot.analyzeTradingFile(
          message, 
          context?.fileType || 'pinescript',
          context?.analysisType || 'optimization'
        );
        break;

      default:
        response = await edgeBot.generateResponse(message, context || {});
    }

    return NextResponse.json({ 
      response,
      success: true 
    });

  } catch (error) {
    console.error('EdgeBot API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'EdgeBot is temporarily unavailable. Please try again in a moment.',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'EdgeBot AI API is running',
    status: 'operational'
  });
}