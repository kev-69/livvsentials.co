import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Plus, RefreshCw, AlertCircle, Bell, CreditCard, BarChart, Send } from 'lucide-react';

// Mock data for notifications service (Termii)
const mockTermiiData = {
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
  const [termiiData, setTermiiData] = useState(mockTermiiData);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [topupAmount, setTopupAmount] = useState('5000');
  
  // Calculate estimated SMS count based on current balance
  const estimatedSMSCount = Math.floor(termiiData.balance / termiiData.costPerSMS);
  
  // Format date for display
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
  const handleTopup = () => {
    setIsLoading(true);
    // Simulate API call to process top-up
    setTimeout(() => {
      setTermiiData({
        ...termiiData,
        balance: termiiData.balance + parseInt(topupAmount)
      });
      toast.success(`Successfully added ${topupAmount} credits to your balance`);
      setIsLoading(false);
      setTopupAmount('5000'); // Reset to default
    }, 1500);
  };
  
  // Handle template status toggle
  interface Template {
    id: string;
    name: string;
    active: boolean;
  }

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
      
      {/* Balance Alert */}
      {termiiData.balance < 500 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start dark:bg-amber-900/20 dark:border-amber-700">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 dark:text-amber-500" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-500">Low Balance Warning</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your notification credit balance is running low. Consider adding more credits to ensure uninterrupted service.
            </p>
          </div>
        </div>
      )}
      
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{termiiData.balance} credits</div>
                <p className="text-xs text-muted-foreground">
                  Approx. {estimatedSMSCount} SMS messages remaining
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{termiiData.usage.today} SMS</div>
                <p className="text-xs text-muted-foreground">
                  {termiiData.usage.today * termiiData.costPerSMS} credits used
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Usage</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{termiiData.usage.thisWeek} SMS</div>
                <p className="text-xs text-muted-foreground">
                  {termiiData.usage.thisWeek * termiiData.costPerSMS} credits used
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{termiiData.usage.thisMonth} SMS</div>
                <p className="text-xs text-muted-foreground">
                  {termiiData.usage.thisMonth * termiiData.costPerSMS} credits used
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Up Balance</CardTitle>
              <CardDescription>
                Add more credits to your Termii account to send SMS notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium" htmlFor="topup-amount">
                    Amount (Credits)
                  </label>
                  <Select value={topupAmount} onValueChange={setTopupAmount}>
                    <SelectTrigger id="topup-amount">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1,000 credits</SelectItem>
                      <SelectItem value="5000">5,000 credits</SelectItem>
                      <SelectItem value="10000">10,000 credits</SelectItem>
                      <SelectItem value="25000">25,000 credits</SelectItem>
                      <SelectItem value="50000">50,000 credits</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {parseInt(topupAmount) / termiiData.costPerSMS} SMS messages approx.
                  </p>
                </div>
                <Button onClick={handleTopup} disabled={isLoading} className="min-w-[120px]">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Top Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recent Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent SMS Notifications</CardTitle>
              <CardDescription>
                View recent SMS notifications sent to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Credits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {termiiData.recentMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.type}</TableCell>
                        <TableCell>{message.recipient}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            message.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : message.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {message.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(message.sentAt)}
                        </TableCell>
                        <TableCell>{message.credits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Manage notification templates for different order events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {termiiData.templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            template.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {template.active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTemplate(template.id)}
                          >
                            {template.active ? 'Disable' : 'Enable'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;