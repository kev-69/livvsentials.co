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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data
const customers = [
  {
    id: "CUST-001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    orders: 8,
    totalSpent: "$643.50",
  },
  {
    id: "CUST-002",
    name: "Michael Brown",
    email: "michael.b@example.com",
    orders: 12,
    totalSpent: "$1,245.75",
  },
  {
    id: "CUST-003",
    name: "Emma Davis",
    email: "emma.d@example.com",
    orders: 5,
    totalSpent: "$392.20",
  },
  {
    id: "CUST-004",
    name: "James Wilson",
    email: "james.w@example.com",
    orders: 18,
    totalSpent: "$2,187.30",
  },
  {
    id: "CUST-005",
    name: "Linda Martinez",
    email: "linda.m@example.com",
    orders: 3,
    totalSpent: "$178.50",
  },
];

const CustomersTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${customer.name.replace(' ', '+')}&background=random`} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{customer.name}</span>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>{customer.totalSpent}</TableCell>
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
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>View orders</DropdownMenuItem>
                    <DropdownMenuItem>Edit customer</DropdownMenuItem>
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

export default CustomersTable;