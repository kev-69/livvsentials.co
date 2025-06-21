import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PendingPayments = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">GHS 3,846.50</div>
        <p className="text-xs text-muted-foreground">
          4 payments awaiting processing
        </p>
      </CardContent>
    </Card>
  );
};

export default PendingPayments;