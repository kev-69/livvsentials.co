import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// Import payment components
import TotalRevenue from '@/components/cards/TotalRevenue';
import PendingPayments from '@/components/cards/PendingPayments';
import RefundRate from '@/components/cards/RefundRate';
import PaymentHistory from '@/components/tables/PaymentHistory';

const PaymentsTab = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Payments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Payment Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
        <TotalRevenue />
        <PendingPayments />
        <RefundRate />
      </div>

      {/* Payment History */}
      <div className="mt-6">
        <PaymentHistory />
      </div>
    </div>
  );
};

export default PaymentsTab;