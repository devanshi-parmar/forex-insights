import { useState } from "react";
import { RefreshCw, Clock } from "lucide-react";
import SignalCard from "../components/SignalCard";
import SignalsTable from "../components/SignalsTable";
import { useSignals } from "../hooks/useSignals";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/utils";

export default function SignalsPage() {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useSignals();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshSignals = async () => {
    setIsRefreshing(true);
    try {
      await apiRequest("POST", "/api/fetchAndAnalyze");
      await refetch();
      toast({
        title: "Success",
        description: "Forex signals have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update signals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section id="signals" className="mb-12 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Forex Signals</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Last updated:</span>
          <span className="text-sm font-medium">
            {dataUpdatedAt ? formatTimeAgo(new Date(dataUpdatedAt)) : "Never"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={refreshSignals}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin mb-4 mx-auto">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p>Loading signals...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-negative">
          <p>Failed to load signals. Please try refreshing.</p>
        </div>
      ) : (
        <>
          {/* Signal cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.signals.slice(0, 3).map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>

          {/* Desktop signals table (hidden on mobile) */}
          <div className="hidden lg:block mt-8">
            <h3 className="text-lg font-medium mb-4">All Signals</h3>
            <SignalsTable signals={data?.signals || []} />
          </div>
        </>
      )}
    </section>
  );
}
