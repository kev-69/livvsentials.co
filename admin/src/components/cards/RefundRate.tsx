import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RefundRate = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Refund Rate</CardTitle>
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3.2%</div>
        <p className="text-xs text-muted-foreground">
          -0.5% from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default RefundRate;