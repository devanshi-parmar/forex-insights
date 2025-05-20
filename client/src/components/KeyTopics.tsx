import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculatePercentage } from "@/lib/utils";

interface KeyTopicsProps {
  topics: Array<{
    keyword: string;
    count: number;
  }>;
}

export default function KeyTopics({ topics }: KeyTopicsProps) {
  // Find the max count to calculate percentages
  const maxCount = topics.length > 0 
    ? Math.max(...topics.map(topic => topic.count)) 
    : 0;
    
  // Format the keyword for display
  const formatKeyword = (keyword: string) => {
    return keyword
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Key Topics Mentioned</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-800 dark:text-gray-200">{formatKeyword(topic.keyword)}</span>
                <span className="text-gray-600 dark:text-gray-400">{topic.count} mentions</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${calculatePercentage(topic.count, maxCount)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
