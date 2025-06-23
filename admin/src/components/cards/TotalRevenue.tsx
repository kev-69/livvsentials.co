import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTotalRevenue } from "@/lib/api"; // Make sure to add this function to your api.ts

interface RevenueData {
  totalRevenue: number;
  growthRate: number;
  currency: string;
}

const TotalRevenue = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchTotalRevenue();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch revenue data:", err);
        setError("Failed to load revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-[150px] mb-1" />
            <Skeleton className="h-4 w-[120px]" />
          </>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : data ? (
          <>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalRevenue)}
            </div>
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

export default TotalRevenue;