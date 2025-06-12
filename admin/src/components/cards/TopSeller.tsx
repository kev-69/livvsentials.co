import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopSeller = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">LV Body Oil</div>
        <p className="text-xs text-muted-foreground">
          386 units sold this month
        </p>
      </CardContent>
    </Card>
  );
};

export default TopSeller;