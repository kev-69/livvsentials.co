import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download,
  Search,
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Import order components
import TotalOrders from '@/components/cards/TotalOrders';
import WeekOrders from '@/components/cards/WeekOrders';
import AvgWeeklyOrders from '@/components/cards/AvgWeeklyOrders';
import OrdersTable from '@/components/tables/OrdersTable';
import PendingOrders from '@/components/tables/PendingOrders';

const OrdersTab = () => {
  const [orderTab, setOrderTab] = useState('pending');

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Orders</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Order Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
        <TotalOrders />
        <WeekOrders />
        <AvgWeeklyOrders />
      </div>

      {/* Order Tabs */}
      <Tabs value={orderTab} onValueChange={setOrderTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                7
              </span>
            </TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <OrdersTable />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <PendingOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersTab;