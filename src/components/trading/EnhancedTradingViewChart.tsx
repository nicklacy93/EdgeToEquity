import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Activity } from 'lucide-react';

interface EnhancedTradingViewChartProps {
  symbol?: string;
  height?: number;
  theme?: 'light' | 'dark';
}

const EnhancedTradingViewChart: React.FC<EnhancedTradingViewChartProps> = ({
  symbol = 'EURUSD',
  height = 400,
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Trading Chart - {symbol}
            {isLoading && (
              <Badge variant="secondary" className="ml-2">
                Loading...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            ref={containerRef}
            style={{ height: height + 'px' }}
            className="w-full relative flex items-center justify-center bg-muted/10"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 animate-spin" />
                <span>Loading TradingView Chart...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-8 w-8" />
                <span>TradingView Chart for {symbol}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTradingViewChart;
