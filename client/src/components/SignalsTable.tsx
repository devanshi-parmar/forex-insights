import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock } from "lucide-react";
import { ForexSignal } from "@/lib/types";
import { formatTimeAgo, getSentimentText } from "@/lib/utils";
import SentimentBadge from "./SentimentBadge";

interface SignalsTableProps {
  signals: ForexSignal[];
}

export default function SignalsTable({ signals }: SignalsTableProps) {
  return (
    <div className="bg-white dark:bg-surface-dark shadow overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currency Pair</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Signal</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sentiment</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Articles</TableHead>
            <TableHead className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
          {signals.map((signal) => (
            <TableRow key={signal.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="currency-pair">{signal.currencyPair}</div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <SentimentBadge type={signal.signal} />
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <span className={
                  signal.sentiment === 'positive' 
                    ? 'text-positive' 
                    : signal.sentiment === 'negative' 
                      ? 'text-negative' 
                      : 'text-yellow-600'
                }>
                  {getSentimentText(signal.sentimentScore)} ({signal.sentimentScore})
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{signal.newsArticleCount}</TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {formatTimeAgo(signal.createdAt as Date)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
