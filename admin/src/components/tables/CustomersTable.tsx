import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Sample data
const customers = [
  {
    id: "CUST-001",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    orders: 8,
    totalSpent: "$643.50",
  },
  {
    id: "CUST-002",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (242) 421 1234",
    orders: 12,
    totalSpent: "$1,245.75",
  },
  {
    id: "CUST-003",
    name: "Emma Davis",
    email: "emma.d@example.com",
    phone: "+1 (121) 123 4567",
    orders: 5,
    totalSpent: "$392.20",
  },
  {
    id: "CUST-004",
    name: "James Wilson",
    email: "james.w@example.com",
    phone: "+1 (555) 987-6543",
    orders: 18,
    totalSpent: "$2,187.30",
  },
  {
    id: "CUST-005",
    name: "Linda Martinez",
    email: "linda.m@example.com",
    phone: "+1 (555) 654-3210",
    orders: 3,
    totalSpent: "$178.50",
  },
  {
    id: "CUST-006",
    name: "Linda Martinez",
    email: "linda.m@example.com",
    phone: "+1 (555) 654-3210",
    orders: 3,
    totalSpent: "$178.50",
  },
  {
    id: "CUST-007",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    orders: 0,
    totalSpent: "",
  },
  {
    id: "CUST-008",
    name: "Alice Smith",
    email: "alice.s@example.com",
    phone: "+1 (555) 321-0987",
    orders: 10,
    totalSpent: "$1,500.00",
  },
  {
    id: "CUST-009",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 000-0000",
    orders: 0,
    totalSpent: "",
  },
  {
    id: "CUST-010",
    name: "Emily Clark",
    email: "emily.c@example.com",
    phone: "+1 (555) 321-0987",
    orders: 10,
    totalSpent: "$1,500.00",
  },
  {
    id: "CUST-011",
    name: "David Lee",
    email: "david.l@example.com",
    phone: "+1 (555) 000-0000",
    orders: 0,
    totalSpent: "",
  },
  {
    id: "CUST-012",
    name: "Sophia Taylor",
    email: "sophia.t@example.com",
    phone: "+1 (555) 321-0987",
    orders: 10,
    totalSpent: "$1,500.00",
  },
  {
    id: "CUST-013",
    name: "William Anderson",
    email: "william.a@example.com",
    phone: "+1 (555) 000-0000",
    orders: 0,
    totalSpent: "",
  },
];

const CustomersTable = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <h2 className="text-lg font-medium dark:text-white">Customer List</h2>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="w-full pl-8"
                />
              </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="recent">Recent Customers</SelectItem>
                    <SelectItem value="active">Active Customers</SelectItem>
                    <SelectItem value="inactive">Inactive Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> 
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[250px]">
          <Table>
            <TableHeader className="sticky top-0 dark:bg-gray-800 z-10">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
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
                  <TableCell>{customer.phone}</TableCell>
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
    </CardContent>
    </Card>
  );
};

export default CustomersTable;