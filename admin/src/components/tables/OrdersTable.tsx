import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Sample data
const orders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    date: "2023-06-10",
    total: "$89.99",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Michael Brown",
    date: "2023-06-09",
    total: "$125.50",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Emma Davis",
    date: "2023-06-08",
    total: "$45.00",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "James Wilson",
    date: "2023-06-07",
    total: "$210.75",
    status: "cancelled",
  },
  {
    id: "ORD-005",
    customer: "Linda Martinez",
    date: "2023-06-06",
    total: "$65.25",
    status: "shipped",
  },
  {
    id: "ORD-006",
    customer: "David Garcia",
    date: "2023-06-05",
    total: "$99.99",
    status: "completed",
  },
  {
    id: "ORD-007",
    customer: "Sophia Rodriguez",
    date: "2023-06-04",
    total: "$150.00",
    status: "processing",
  },
  {
    id: "ORD-008",
    customer: "William Lee",
    date: "2023-06-03",
    total: "$75.50",
    status: "cancelled",
  },
  {
    id: "ORD-009",
    customer: "Olivia Walker",
    date: "2023-06-02",
    total: "$120.00",
    status: "shipped",
  },
  {
    id: "ORD-010",
    customer: "Benjamin Hall",
    date: "2023-06-01",
    total: "$89.99",
    status: "completed",
  },
];

const getStatusColor = (status: any) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrdersTable = () => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-y-auto max-h-[250px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Print invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;