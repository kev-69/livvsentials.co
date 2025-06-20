import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Import customer components
import TotalCustomers from '@/components/cards/TotalCustomers';
import GuestCustomers from '@/components/cards/GuestCustomers';
import CustomersTable from '@/components/tables/CustomersTable';

const CustomersTab = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Users Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 mt-6 mb-6">
        <TotalCustomers />
        {/* <CustomerGrowth /> */}
        <GuestCustomers />
      </div>

      {/* User Search and Filter */}
      <div className="mt-6">
        <CustomersTable />
      </div>
    </div>
  );
};

export default CustomersTab;