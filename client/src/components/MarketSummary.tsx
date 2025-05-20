import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculatePercentage } from "@/lib/utils";

interface MarketSummaryProps {
  buySignals: number;
  sellSignals: number;
  holdSignals: number;
  topCurrencies: Array<{
    currency: string;
    count: number;
  }>;
}

export default function MarketSummary({ buySignals, sellSignals, holdSignals, topCurrencies }: MarketSummaryProps) {
  const totalSignals = buySignals + sellSignals + holdSignals;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Bullish signals:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{buySignals}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-positive h-2 rounded-full" 
                style={{ width: `${calculatePercentage(buySignals, totalSignals)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Bearish signals:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{sellSignals}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-negative h-2 rounded-full" 
                style={{ width: `${calculatePercentage(sellSignals, totalSignals)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Neutral signals:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{holdSignals}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-neutral h-2 rounded-full" 
                style={{ width: `${calculatePercentage(holdSignals, totalSignals)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Top mentioned currencies</h4>
          <div className="flex flex-wrap gap-2">
            {topCurrencies.map((currency, index) => (
              <div key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                {currency.currency} ({currency.count})
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
