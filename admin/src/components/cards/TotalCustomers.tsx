import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserStats } from "@/lib/api";

interface UserStatsData {
  totalCustomers: number;
  newCustomersThisMonth: number;
  lastMonthCustomers: number;
  growthRate: number;
}

const TotalCustomers = () => {
  const [data, setData] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUserStats();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch customer data:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
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
            <div className="text-2xl font-bold">{data.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.growthRate > 0 ? (
                <span className="text-green-500">
                  +{data.growthRate.toFixed(1)}% from last month
                </span>
              ) : data.growthRate < 0 ? (
                <span className="text-red-500">
                  {data.growthRate.toFixed(1)}% from last month
                </span>
              ) : (
                "No change from last month"
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

export default TotalCustomers;