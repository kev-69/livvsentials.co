import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Sample data
const payments = [
  {
    id: "PAY-001",
    customer: "Sarah Johnson",
    method: "Credit Card",
    date: "2023-06-10",
    amount: "$89.99",
    status: "completed",
  },
  {
    id: "PAY-002",
    customer: "Michael Brown",
    method: "PayPal",
    date: "2023-06-09",
    amount: "$125.50",
    status: "processing",
  },
  {
    id: "PAY-003",
    customer: "Emma Davis",
    method: "Credit Card",
    date: "2023-06-08",
    amount: "$45.00",
    status: "completed",
  },
  {
    id: "PAY-004",
    customer: "James Wilson",
    method: "Bank Transfer",
    date: "2023-06-07",
    amount: "$210.75",
    status: "failed",
  },
  {
    id: "PAY-005",
    customer: "Linda Martinez",
    method: "Credit Card",
    date: "2023-06-06",
    amount: "$65.25",
    status: "completed",
  },
];

const getStatusColor = (status: any) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const PaymentsTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.customer}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(payment.status)}>
                  {payment.status}
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
                    <DropdownMenuItem>Refund payment</DropdownMenuItem>
                    <DropdownMenuItem>Download receipt</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;