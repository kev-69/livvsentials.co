import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProcessingPayments } from "@/lib/api"; // Make sure to add this function to your api.ts

interface ProcessingPaymentsData {
  totalProcessingAmount: number;
  count: number;
  currency: string;
}

const PendingPayments = () => {
  const [data, setData] = useState<ProcessingPaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchProcessingPayments();
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch processing payments data:", err);
        setError("Failed to load pending payments");
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
        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
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
              {formatCurrency(data.totalProcessingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.count} payment{data.count !== 1 ? "s" : ""} awaiting processing
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No pending payments</div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingPayments;