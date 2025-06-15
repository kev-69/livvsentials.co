import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, DownloadIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample data for payment history
const payments = [
  {
    id: "PMT-001",
    customer: "Alex Thompson",
    date: "2023-06-15",
    paymentMethod: "Credit Card",
    orderId: "ORD-P001",
    status: "completed",
    amount: "$124.99",
  },
  {
    id: "PMT-002",
    customer: "Jessica Miller",
    date: "2023-06-15",
    paymentMethod: "Momo",
    orderId: "ORD-P002",
    status: "processing",
    amount: "$89.50",
  },
  {
    id: "PMT-003",
    customer: "Robert Chen",
    date: "2023-06-14",
    paymentMethod: "Momo",
    orderId: "ORD-P003",
    status: "failed",
    amount: "$215.75",
  },
  {
    id: "PMT-004",
    customer: "Olivia Wilson",
    date: "2023-06-14",
    paymentMethod: "Credit Card",
    orderId: "ORD-P004",
    status: "completed",
    amount: "$45.99",
  },
  {
    id: "PMT-005",
    customer: "Ethan Davis",
    date: "2023-06-13",
    paymentMethod: "Momo",
    orderId: "ORD-P005",
    status: "refunded",
    amount: "$167.25",
  },
  {
    id: "PMT-006",
    customer: "Sophia Martinez",
    date: "2023-06-13",
    paymentMethod: "Momo",
    orderId: "ORD-P006",
    status: "completed",
    amount: "$99.00",
  },
  {
    id: "PMT-007",
    customer: "William Johnson",
    date: "2023-06-12",
    paymentMethod: "Credit Card",
    orderId: "ORD-P007",
    status: "processing",
    amount: "$135.50",
  },
  {
    id: "PMT-008",
    customer: "Emma Brown",
    date: "2023-06-12",
    paymentMethod: "Momo",
    orderId: "ORD-P008",
    status: "completed",
    amount: "$78.25",
  },
  {
    id: "PMT-009",
    customer: "Noah Garcia",
    date: "2023-06-11",
    paymentMethod: "Credit Card",
    orderId: "ORD-P009",
    status: "refunded",
    amount: "$142.30",
  },
  {
    id: "PMT-010",
    customer: "Ava Rodriguez",
    date: "2023-06-11",
    paymentMethod: "Momo",
    orderId: "ORD-P010",
    status: "completed",
    amount: "$65.99",
  },
  {
    id: "PMT-011",
    customer: "Liam Martinez",
    date: "2023-06-10",
    paymentMethod: "Credit Card",
    orderId: "ORD-P011",
    status: "failed",
    amount: "$112.45",
  },
  {
    id: "PMT-012",
    customer: "Isabella Wilson",
    date: "2023-06-10",
    paymentMethod: "Momo",
    orderId: "ORD-P012",
    status: "completed",
    amount: "$93.75",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PaymentHistory = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium dark:text-white">Payment History</h2>
            <div className="flex w-full sm:w-auto gap-2 max-w-xs ml-auto">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search payments..."
                  className="w-full pl-8"
                  />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[250px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download Receipt">
                        <DownloadIcon className="h-4 w-4" />
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

export default PaymentHistory;