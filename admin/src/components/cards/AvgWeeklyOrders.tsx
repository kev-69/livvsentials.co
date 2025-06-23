import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeeklyOrdersAvg } from "@/lib/api";

interface WeeklyOrdersData {
  avgWeeklyOrders: number;
  totalOrders: number;
  periodInWeeks: number;
}

const AvgWeeklyOrders = () => {
  const [data, setData] = useState<WeeklyOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getWeeklyOrdersAvg();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch weekly orders data:", err);
        setError("Failed to load weekly orders data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Orders</CardTitle>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">
              {Math.round(data.avgWeeklyOrders).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Average over {data.periodInWeeks} weeks
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvgWeeklyOrders;