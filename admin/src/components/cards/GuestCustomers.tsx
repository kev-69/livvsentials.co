import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuestCheckouts } from "@/lib/api";

interface GuestCheckoutsData {
  totalGuestOrders: number;
  totalOrders: number;
  percentage: number;
}

const GuestCustomers = () => {
  const [data, setData] = useState<GuestCheckoutsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getGuestCheckouts();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch guest checkout data:", err);
        setError("Failed to load guest checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Guest Checkouts</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
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
            <div className="text-2xl font-bold">{data.totalGuestOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.percentage.toFixed(1)}% of total orders
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div 
                className="h-1 rounded-full bg-primary" 
                style={{ width: `${Math.min(data.percentage, 100)}%` }}
              ></div>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestCustomers;