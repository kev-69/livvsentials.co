import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, RefreshCw, BarChart, Send, Bell } from 'lucide-react';
import { CreditCard } from 'lucide-react';

// Import our new card components
import UsageStatsCard from '@/components/cards/UsageStatsCard';
import TopUpBalanceCard from '@/components/cards/TopUpBalanceCard';
import RecentMessagesCard from '@/components/cards/RecentMessagesCard';
import NotificationTemplatesCard from '@/components/cards/NotificationTemplatesCard';
import LowBalanceAlert from '@/components/alerts/LowBalanceAlert';

// Types
interface TermiiData {
  balance: number;
  costPerSMS: number;
  usage: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  recentMessages: {
    id: number;
    type: string;
    recipient: string;
    status: 'delivered' | 'failed' | 'pending';
    sentAt: string;
    credits: number;
  }[];
  templates: {
    id: string;
    name: string;
    active: boolean;
  }[];
}

// Mock data for notifications service (Termii)
const mockTermiiData: TermiiData = {
  balance: 3250, // SMS credits remaining
  costPerSMS: 3, // Credits per SMS
  usage: {
    today: 24,
    thisWeek: 142,
    thisMonth: 587,
    total: 2745
  },
  recentMessages: [
    { id: 1, type: 'Order Confirmation', recipient: '+2348123456789', status: 'delivered', sentAt: '2025-06-20T09:15:00Z', credits: 3 },
    { id: 2, type: 'Shipping Update', recipient: '+2347098765432', status: 'delivered', sentAt: '2025-06-19T14:30:00Z', credits: 3 },
    { id: 3, type: 'Order Cancellation', recipient: '+2349876543210', status: 'failed', sentAt: '2025-06-18T11:20:00Z', credits: 0 },
    { id: 4, type: 'Delivery Confirmation', recipient: '+2348012345678', status: 'delivered', sentAt: '2025-06-17T16:45:00Z', credits: 3 },
    { id: 5, type: 'Payment Reminder', recipient: '+2348109876543', status: 'pending', sentAt: '2025-06-16T08:30:00Z', credits: 3 }
  ],
  templates: [
    { id: 'tmpl_order_confirm', name: 'Order Confirmation', active: true },
    { id: 'tmpl_ship_update', name: 'Shipping Update', active: true },
    { id: 'tmpl_delivery', name: 'Delivery Confirmation', active: true },
    { id: 'tmpl_cancel', name: 'Order Cancellation', active: true },
    { id: 'tmpl_payment', name: 'Payment Reminder', active: false }
  ]
};

const NotificationsTab = () => {
  const [termiiData, setTermiiData] = useState<TermiiData>(mockTermiiData);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate estimated SMS count based on current balance
  const estimatedSMSCount = Math.floor(termiiData.balance / termiiData.costPerSMS);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle refreshing stats
  const handleRefreshStats = () => {
    setIsLoading(true);
    // Simulate API call to refresh stats
    setTimeout(() => {
      toast.success('Notification stats refreshed');
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle balance top-up
  const handleTopup = async (amount: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          setTermiiData({
            ...termiiData,
            balance: termiiData.balance + amount
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1500);
    });
  };
  
  // Handle template status toggle
  const handleToggleTemplate = (templateId: string): void => {
    setTermiiData({
      ...termiiData,
      templates: termiiData.templates.map(template => 
        template.id === templateId 
          ? { ...template, active: !template.active }
          : template
      )
    });
    
    const template = termiiData.templates.find(t => t.id === templateId);
    
    if (template) {
      toast.success(`${template.name} template ${template.active ? 'disabled' : 'enabled'}`);
    }
  };
  
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">
            Notification Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage Termii SMS notifications for customer orders
          </p>
        </div>
        <Button onClick={handleRefreshStats} disabled={isLoading} variant="outline">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Stats
        </Button>
      </div>
      
      {/* Low Balance Alert */}
      <LowBalanceAlert show={termiiData.balance < 500} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary/10">
            <Send className="h-4 w-4 mr-2" />
            Recent Messages
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary/10">
            <Bell className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <UsageStatsCard 
              title="Current Balance"
              value={`${termiiData.balance} credits`}
              subtitle={`Approx. ${estimatedSMSCount} SMS messages remaining`}
              icon={CreditCard}
            />
            
            <UsageStatsCard 
              title="Today's Usage"
              value={`${termiiData.usage.today} SMS`}
              subtitle={`${termiiData.usage.today * termiiData.costPerSMS} credits used`}
              icon={Send}
            />
            
            <UsageStatsCard 
              title="Weekly Usage"
              value={`${termiiData.usage.thisWeek} SMS`}
              subtitle={`${termiiData.usage.thisWeek * termiiData.costPerSMS} credits used`}
              icon={BarChart}
            />
            
            <UsageStatsCard 
              title="Monthly Usage"
              value={`${termiiData.usage.thisMonth} SMS`}
              subtitle={`${termiiData.usage.thisMonth * termiiData.costPerSMS} credits used`}
              icon={BarChart}
            />
          </div>
          
          <TopUpBalanceCard 
            costPerSMS={termiiData.costPerSMS}
            onTopUp={handleTopup}
          />
        </TabsContent>
        
        {/* Recent Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <RecentMessagesCard 
            messages={termiiData.recentMessages}
            formatDate={formatDate}
          />
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <NotificationTemplatesCard 
            templates={termiiData.templates}
            onToggleTemplate={handleToggleTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;