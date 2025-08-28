import { NextRequest, NextResponse } from 'next/server';
import { SmartAIRouter } from '@/lib/ai/SmartAIRouter';
import { AIRequest } from '@/types/ai';

const router = new SmartAIRouter();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, context, requestType = 'general' } = body;

    // Validate required fields
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Check if system is within budget
    const systemStats = await router.getSystemStats();
    if (systemStats.totalCost >= 150) {
      return NextResponse.json(
        { 
          error: 'Beta testing period has ended due to budget limits',
          stats: systemStats
        },
        { status: 429 }
      );
    }

    // Create AI request
    const aiRequest: AIRequest = {
      userId,
      message,
      context,
      requestType,
      timestamp: new Date()
    };

    // Process with smart router
    const aiResponse = await router.processRequest(aiRequest);

    // Get updated user stats
    const userStats = await router.getUserStats(userId);

    return NextResponse.json({
      message: aiResponse.message,
      provider: aiResponse.provider.name,
      cost: aiResponse.cost,
      processingTime: aiResponse.processingTime,
      userStats,
      systemStats: await router.getSystemStats()
    });

  } catch (error: any) {
    console.error('AI API Error:', error);
    
    // Handle specific limit errors
    if (error.message.includes('limit exceeded')) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

// Get usage statistics
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
      // Get user-specific stats
      const userStats = await router.getUserStats(userId);
      return NextResponse.json({ userStats });
    } else {
      // Get system stats
      const systemStats = await router.getSystemStats();
      return NextResponse.json({ systemStats });
    }

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
