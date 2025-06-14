import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GuestCustomers = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Guest Checkouts</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,254</div>
        <p className="text-xs text-muted-foreground">
          32% of total orders
        </p>
        {/* <div className="mt-2 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-1 w-[32%] rounded-full bg-primary"></div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default GuestCustomers;