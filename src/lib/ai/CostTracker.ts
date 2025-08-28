import { CostTracking, UserUsageStats, SystemUsageStats } from '@/types/ai';

export class CostTracker {
  private readonly COST_LIMIT = 150; // $150 budget limit
  private readonly DAILY_USER_LIMIT = 3; // 3 conversations per day per user
  private readonly TOTAL_USER_LIMIT = 10; // 10 total conversations per user

  /**
   * Track AI usage and costs
   */
  async trackUsage(tracking: CostTracking): Promise<void> {
    try {
      // Store in database (implement your preferred storage)
      // For now, we'll use a simple file-based approach for beta
      const usage = await this.getCurrentUsage();
      usage.push(tracking);
      
      // Save updated usage
      await this.saveUsage(usage);
      
      // Check limits
      await this.checkLimits(tracking.userId);
      
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  /**
   * Check if user has exceeded limits
   */
  async checkLimits(userId: string): Promise<void> {
    const userStats = await this.getUserStats(userId);
    const systemStats = await this.getSystemStats();

    // Check system cost limit
    if (systemStats.totalCost >= this.COST_LIMIT) {
      throw new Error(`System cost limit exceeded: $${systemStats.totalCost.toFixed(4)}`);
    }

    // Check user conversation limits
    if (userStats.requestCount >= this.TOTAL_USER_LIMIT) {
      throw new Error(`User conversation limit exceeded: ${userStats.requestCount}/${this.TOTAL_USER_LIMIT}`);
    }

    // Check daily user limit
    const today = new Date().toDateString();
    const todayRequests = await this.getUserDailyRequests(userId, today);
    if (todayRequests >= this.DAILY_USER_LIMIT) {
      throw new Error(`Daily conversation limit exceeded: ${todayRequests}/${this.DAILY_USER_LIMIT}`);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserUsageStats> {
    const usage = await this.getCurrentUsage();
    const userUsage = usage.filter(u => u.userId === userId);

    const stats: UserUsageStats = {
      userId,
      totalCost: 0,
      requestCount: userUsage.length,
      providerBreakdown: {
        openai: { cost: 0, requests: 0, tokens: 0 },
        claude: { cost: 0, requests: 0, tokens: 0 }
      },
      typeBreakdown: {
        technical: { cost: 0, requests: 0 },
        psychology: { cost: 0, requests: 0 },
        education: { cost: 0, requests: 0 },
        general: { cost: 0, requests: 0 }
      },
      lastActivity: new Date()
    };

    userUsage.forEach(u => {
      stats.totalCost += u.cost;
      
      // Provider breakdown
      stats.providerBreakdown[u.provider].cost += u.cost;
      stats.providerBreakdown[u.provider].requests += 1;
      stats.providerBreakdown[u.provider].tokens += u.tokensUsed;
      
      // Type breakdown
      if (stats.typeBreakdown[u.requestType as keyof typeof stats.typeBreakdown]) {
        stats.typeBreakdown[u.requestType as keyof typeof stats.typeBreakdown].cost += u.cost;
        stats.typeBreakdown[u.requestType as keyof typeof stats.typeBreakdown].requests += 1;
      }

      // Update last activity
      if (u.timestamp > stats.lastActivity) {
        stats.lastActivity = u.timestamp;
      }
    });

    return stats;
  }

  /**
   * Get system-wide statistics
   */
  async getSystemStats(): Promise<SystemUsageStats> {
    const usage = await this.getCurrentUsage();
    const uniqueUsers = new Set(usage.map(u => u.userId));

    const stats: SystemUsageStats = {
      totalCost: usage.reduce((sum, u) => sum + u.cost, 0),
      totalRequests: usage.length,
      activeUsers: uniqueUsers.size,
      providerCosts: {
        openai: usage.filter(u => u.provider === 'openai').reduce((sum, u) => sum + u.cost, 0),
        claude: usage.filter(u => u.provider === 'claude').reduce((sum, u) => sum + u.cost, 0)
      },
      dailyUsage: this.getDailyUsageBreakdown(usage)
    };

    return stats;
  }

  /**
   * Get user's daily request count
   */
  private async getUserDailyRequests(userId: string, date: string): Promise<number> {
    const usage = await this.getCurrentUsage();
    return usage.filter(u => 
      u.userId === userId && 
      u.timestamp.toDateString() === date
    ).length;
  }

  /**
   * Get daily usage breakdown
   */
  private getDailyUsageBreakdown(usage: CostTracking[]): Array<{date: string; cost: number; requests: number}> {
    const dailyMap = new Map<string, {cost: number; requests: number}>();

    usage.forEach(u => {
      const date = u.timestamp.toDateString();
      const existing = dailyMap.get(date) || { cost: 0, requests: 0 };
      dailyMap.set(date, {
        cost: existing.cost + u.cost,
        requests: existing.requests + 1
      });
    });

    return Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Load current usage data
   */
  private async getCurrentUsage(): Promise<CostTracking[]> {
    try {
      // In production, this would be from your database
      // For beta, using simple file storage
      const fs = require('fs').promises;
      const path = 'data/usage.json';
      
      try {
        const data = await fs.readFile(path, 'utf8');
        return JSON.parse(data).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (error) {
        // File doesn't exist, return empty array
        return [];
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
      return [];
    }
  }

  /**
   * Save usage data
   */
  private async saveUsage(usage: CostTracking[]): Promise<void> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      // Ensure data directory exists
      await fs.mkdir('data', { recursive: true });
      
      // Save usage data
      await fs.writeFile('data/usage.json', JSON.stringify(usage, null, 2));
    } catch (error) {
      console.error('Error saving usage data:', error);
      throw error;
    }
  }

  /**
   * Get remaining budget
   */
  async getRemainingBudget(): Promise<number> {
    const stats = await this.getSystemStats();
    return Math.max(0, this.COST_LIMIT - stats.totalCost);
  }

  /**
   * Check if system is within budget
   */
  async isWithinBudget(): Promise<boolean> {
    const remaining = await this.getRemainingBudget();
    return remaining > 0;
  }
}
