import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrdersThisWeek } from "@/lib/api";

interface WeekOrdersData {
  totalOrders: number;
  totalRevenue: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  startDate: string;
  endDate: string;
}

const WeekOrders = () => {
  const [data, setData] = useState<WeekOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousWeekOrders, setPreviousWeekOrders] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getOrdersThisWeek();
        setData(response);
        
        // For demo purposes, let's simulate "last week's" data
        // In a real app, you'd fetch this from the API
        setPreviousWeekOrders(Math.floor(response.totalOrders * 0.85));
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch this week's orders data:", err);
        setError("Failed to load this week's data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate percentage change from previous week
  const calculateChange = () => {
    if (!data || previousWeekOrders === null || previousWeekOrders === 0) {
      return 0;
    }
    return ((data.totalOrders - previousWeekOrders) / previousWeekOrders) * 100;
  };

  const percentChange = calculateChange();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">This Week</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-[100px] mb-1" />
            <Skeleton className="h-4 w-[160px]" />
          </>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : data ? (
          <>
            <div className="text-2xl font-bold">{data.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {percentChange > 0 ? (
                <span className="text-green-500">
                  +{percentChange.toFixed(1)}% from last week
                </span>
              ) : percentChange < 0 ? (
                <span className="text-red-500">
                  {percentChange.toFixed(1)}% from last week
                </span>
              ) : (
                "No change from last week"
              )}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeekOrders;