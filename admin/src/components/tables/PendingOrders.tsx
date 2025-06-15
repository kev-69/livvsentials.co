import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
    // Clock, 
    CheckCircle, 
    XCircle, 
    Eye 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data for pending orders
const pendingOrders = [
  {
    id: "ORD-P001",
    customer: "Alex Thompson",
    date: "2023-06-15",
    total: "$124.99",
    status: "payment_pending",
    items: 3,
  },
  {
    id: "ORD-P002",
    customer: "Jessica Miller",
    date: "2023-06-15",
    total: "$89.50",
    status: "processing",
    items: 2,
  },
  {
    id: "ORD-P003",
    customer: "Robert Chen",
    date: "2023-06-14",
    total: "$215.75",
    status: "awaiting_fulfillment",
    items: 5,
  },
  {
    id: "ORD-P004",
    customer: "Olivia Wilson",
    date: "2023-06-14",
    total: "$45.99",
    status: "processing",
    items: 1,
  },
  {
    id: "ORD-P005",
    customer: "Ethan Davis",
    date: "2023-06-13",
    total: "$167.25",
    status: "payment_pending",
    items: 4,
  },
  {
    id: "ORD-P006",
    customer: "Sophia Martinez",
    date: "2023-06-13",
    total: "$99.00",
    status: "awaiting_fulfillment",
    items: 2,
  },
  {
    id: "ORD-P007",
    customer: "William Johnson",
    date: "2023-06-12",
    total: "$135.50",
    status: "processing",
    items: 3,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "payment_pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "awaiting_fulfillment":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "payment_pending":
      return "Payment Pending";
    case "processing":
      return "Processing";
    case "awaiting_fulfillment":
      return "Awaiting Fulfillment";
    default:
      return status.replace(/_/g, " ");
  }
};

const PendingOrders = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium dark:text-white">Pending Orders</h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[250px]">
          <Table>
            <TableHeader className="sticky top-0 dark:bg-gray-800 z-10">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Order">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-green-600" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingOrders;