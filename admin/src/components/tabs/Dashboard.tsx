import TotalRevenue from '@/components/cards/TotalRevenue';
import AvgWeeklyOrders from '@/components/cards/AvgWeeklyOrders';
import TotalCustomers from '@/components/cards/TotalCustomers';
import OrderChart from '@/components/charts/OrderChart';
// import ActivityFeed from '@/components/cards/ActivityFeed';
import TopSelling from '@/components/tables/TopSelling';
import TopSeller from '../cards/TopSeller';

const DashboardTab = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Overview</h1>
      </div>
      
      {/* Dashboard Metrics */}
      <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
        <TotalRevenue />
        <AvgWeeklyOrders />
        <TotalCustomers />
      </div>
      
      {/* Order Chart */}
      <div className="mb-6 dashboard-card rounded-lg" style={{ height: "350px" }}>
        <OrderChart />
      </div>
      
      {/* Top selling products and Activity Feed side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 lg:mt-20">
        {/* Recent Orders - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <TopSelling />
        </div>
        
        {/* Activity Feed - Takes 1/3 of the width */}
        <div>
          <TopSeller />
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;