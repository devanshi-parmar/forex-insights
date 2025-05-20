import { cn, getSentimentColor, getSignalColor } from "@/lib/utils";
import { SentimentType, SignalType } from "@/lib/types";

interface SentimentBadgeProps {
  type: SentimentType | SignalType;
  className?: string;
}

export default function SentimentBadge({ type, className }: SentimentBadgeProps) {
  const isSignal = ['buy', 'sell', 'hold'].includes(type as string);
  
  const getClassName = () => {
    if (isSignal) {
      return getSignalColor(type as string);
    }
    return getSentimentColor(type as string);
  };
  
  // Format text with proper capitalization
  const formatText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className={cn("sentiment-badge px-2 py-1 rounded text-xs font-medium", getClassName(), className)}>
      {formatText(type)}
    </div>
  );
}
