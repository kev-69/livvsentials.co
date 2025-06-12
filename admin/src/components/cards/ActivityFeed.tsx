import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, User, CreditCard, Package } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "order",
    message: "New order placed by Sarah Johnson",
    time: "2 minutes ago",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: 2,
    type: "customer",
    message: "New customer registered",
    time: "15 minutes ago",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 3,
    type: "payment",
    message: "Payment received for order #1234",
    time: "32 minutes ago",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: 4,
    type: "order",
    message: "Order #1232 has been shipped",
    time: "1 hour ago",
    icon: <Package className="h-4 w-4" />,
  },
  {
    id: 5,
    type: "customer",
    message: "Customer updated their profile",
    time: "2 hours ago",
    icon: <User className="h-4 w-4" />,
  },
];

const getActivityColor = (type: any) => {
  switch (type) {
    case "order":
      return "bg-blue-100 text-blue-600";
    case "customer":
      return "bg-green-100 text-green-600";
    case "payment":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ActivityFeed = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[250px]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;