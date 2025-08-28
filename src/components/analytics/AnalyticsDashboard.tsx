'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SystemUsageStats, UserUsageStats } from '@/types/ai';

interface AnalyticsDashboardProps {
  userId?: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [systemStats, setSystemStats] = useState<SystemUsageStats | null>(null);
  const [userStats, setUserStats] = useState<UserUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      
      // Load system stats
      const systemResponse = await fetch('/api/ai');
      const systemData = await systemResponse.json();
      setSystemStats(systemData.systemStats);

      // Load user stats if userId provided
      if (userId) {
        const userResponse = await fetch(`/api/ai?userId=${userId}`);
        const userData = await userResponse.json();
        setUserStats(userData.userStats);
      }

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</motion.div>
      </motion.div>
    );
  }

  const budgetUsedPercentage = systemStats ? (systemStats.totalCost / 150) * 100 : 0;
  const budgetRemaining = 150 - (systemStats?.totalCost || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">EdgeToEquity Analytics</h2>
        <Button 
          onClick={loadStats} 
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </motion.div>

      {/* System Overview */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${systemStats.totalCost.toFixed(4)}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                of $150.00 budget
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    budgetUsedPercentage > 90 ? 'bg-red-500' :
                    budgetUsedPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                />
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${budgetRemaining.toFixed(4)}
              </motion.div>
              <Badge variant={budgetRemaining > 30 ? 'default' : 'destructive'}>
                {budgetUsedPercentage.toFixed(1)}% used
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.totalRequests}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                across all users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.activeUsers}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                beta testers
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Provider Breakdown */}
      {systemStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">OpenAI</Badge>
                    <span className="text-sm text-muted-foreground">Technical Analysis</span>
                  </motion.div>
                  <span className="font-bold">
                    ${systemStats.providerCosts.openai.toFixed(4)}
                  </span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Claude</Badge>
                    <span className="text-sm text-muted-foreground">Psychology & Education</span>
                  </motion.div>
                  <span className="font-bold">
                    ${systemStats.providerCosts.claude.toFixed(4)}
                  </span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Usage Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemStats.dailyUsage.slice(-7).map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{day.requests} requests</span>
                      <span className="font-bold">${day.cost.toFixed(4)}</span>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Usage Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Cost:</span>
                  <span className="font-bold">${userStats.totalCost.toFixed(4)}</span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <span>Conversations:</span>
                  <span className="font-bold">{userStats.requestCount}/10</span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <span>Last Activity:</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.lastActivity.toLocaleDateString()}
                  </span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technical Analysis:</span>
                  <span className="font-bold">{userStats.typeBreakdown.technical.requests}</span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Psychology Coaching:</span>
                  <span className="font-bold">{userStats.typeBreakdown.psychology.requests}</span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Education:</span>
                  <span className="font-bold">{userStats.typeBreakdown.education.requests}</span>
                </motion.div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">General:</span>
                  <span className="font-bold">{userStats.typeBreakdown.general.requests}</span>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Warning Messages */}
      {systemStats && (
        <div className="space-y-2">
          {budgetUsedPercentage > 90 && (
            <Card className="border-red-500 bg-red-50">
              <CardContent className="pt-4">
                <p className="text-red-800 font-semibold">
                  ?? Critical: Budget 90% depleted! Beta testing will end soon.
                </p>
              </CardContent>
            </Card>
          )}
          
          {budgetUsedPercentage > 70 && budgetUsedPercentage <= 90 && (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardContent className="pt-4">
                <p className="text-yellow-800">
                  ?? Warning: Budget 70% used. Monitor usage carefully.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

