import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface EventProps {
  events: Array<{
    name: string;
    type: string;
    timestamp: string | Date;
  }>;
}

export default function RecentEvents({ events }: EventProps) {
  const getIconForEventType = (type: string) => {
    switch (type) {
      case 'positive':
        return (
          <div className="bg-positive-light rounded-full p-2 mr-3">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        );
      case 'negative':
        return (
          <div className="bg-negative-light rounded-full p-2 mr-3">
            <TrendingDown className="h-4 w-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-neutral-light rounded-full p-2 mr-3">
            <Minus className="h-4 w-4 text-gray-800" />
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Major Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start">
              {getIconForEventType(event.type)}
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{formatTimeAgo(event.timestamp as Date)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="#" className="text-primary text-sm font-medium">View all events</a>
        </div>
      </CardContent>
    </Card>
  );
}
