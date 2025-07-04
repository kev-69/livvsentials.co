import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download,
} from 'lucide-react';
import { fetchPendingOrders } from '@/lib/api'

// Import order components
import TotalOrders from '@/components/cards/TotalOrders';
import WeekOrders from '@/components/cards/WeekOrders';
import AvgWeeklyOrders from '@/components/cards/AvgWeeklyOrders';
import OrdersTable from '@/components/tables/OrdersTable';
import PendingOrders from '@/components/tables/PendingOrders';
import { toast } from 'sonner';


const OrdersTab = () => {
  const [orderTab, setOrderTab] = useState('pending');
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Function to fetch and update pending orders count
  const updatePendingOrdersCount = async () => {
    try {
      const response = await fetchPendingOrders();
      setPendingOrdersCount(response.length);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  // Fetch pending orders count on component mount
  useState(() => {
    updatePendingOrdersCount();
  });

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
            <TabsTrigger value="pending" onClick={() => {
              updatePendingOrdersCount();
              toast.info(`You have ${pendingOrdersCount} pending orders to attend to`);
            }}>
              Pending
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {pendingOrdersCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
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