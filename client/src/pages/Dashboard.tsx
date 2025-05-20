import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import MarketSummary from "../components/MarketSummary";
import KeyTopics from "../components/KeyTopics";
import RecentEvents from "../components/RecentEvents";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardData } from "@/lib/types";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  const { 
    data, 
    isLoading, 
    isError, 
    refetch, 
    dataUpdatedAt 
  } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await apiRequest("POST", "/api/fetchAndAnalyze");
      await refetch();
      toast({
        title: "Success",
        description: "Dashboard data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin mb-4 mx-auto">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20 text-negative">
        <p>Failed to load dashboard data. Please try refreshing.</p>
        <Button 
          className="mt-4" 
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <section className="mt-6 mb-12 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={refreshDashboard}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MarketSummary 
          buySignals={data.signalCounts.buy} 
          sellSignals={data.signalCounts.sell} 
          holdSignals={data.signalCounts.hold} 
          topCurrencies={data.topCurrencies} 
        />
        <KeyTopics topics={data.topKeywords} />
        <RecentEvents events={data.recentEvents} />
      </div>
    </section>
  );
}
