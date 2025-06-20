import { useState } from 'react';
import { 
  MessageSquare, 
  UserCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample data for support tickets
const supportTickets = [
  {
    id: 'TICKET-001',
    subject: 'Order not delivered',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'open',
    priority: 'high',
    created: '2023-06-15',
    messages: [
      {
        sender: 'customer',
        content: 'My order #ORD-001 was supposed to be delivered yesterday but I haven\'t received it yet. Can you help?',
        timestamp: '2023-06-15T10:30:00',
      }
    ]
  },
  {
    id: 'TICKET-002',
    subject: 'Refund request',
    customer: 'Michael Brown',
    email: 'michael.b@example.com',
    status: 'pending',
    priority: 'medium',
    created: '2023-06-14',
    messages: [
      {
        sender: 'customer',
        content: 'I would like to request a refund for my order #ORD-002. The product is not what I expected.',
        timestamp: '2023-06-14T14:45:00',
      },
      {
        sender: 'admin',
        content: 'I understand your concern. Could you please provide more details about the issue with the product?',
        timestamp: '2023-06-14T15:20:00',
      },
      {
        sender: 'customer',
        content: 'The color is different from what was shown on the website, and the size is too small.',
        timestamp: '2023-06-14T15:45:00',
      }
    ]
  },
  {
    id: 'TICKET-003',
    subject: 'Question about product',
    customer: 'Emma Davis',
    email: 'emma.d@example.com',
    status: 'resolved',
    priority: 'low',
    created: '2023-06-12',
    messages: [
      {
        sender: 'customer',
        content: 'I have a question about the Blue T-Shirt. Is it machine washable?',
        timestamp: '2023-06-12T09:15:00',
      },
      {
        sender: 'admin',
        content: 'Yes, the Blue T-Shirt is machine washable. We recommend washing it in cold water and tumble dry on low heat.',
        timestamp: '2023-06-12T10:00:00',
      },
      {
        sender: 'customer',
        content: 'Thank you for the information!',
        timestamp: '2023-06-12T10:30:00',
      },
      {
        sender: 'admin',
        content: 'You\'re welcome! Let us know if you have any other questions.',
        timestamp: '2023-06-12T11:00:00',
      }
    ]
  },
  {
    id: 'TICKET-004',
    subject: 'Website error',
    customer: 'James Wilson',
    email: 'james.w@example.com',
    status: 'open',
    priority: 'high',
    created: '2023-06-10',
    messages: [
      {
        sender: 'customer',
        content: 'I\'m getting an error when trying to checkout. It says "Payment processing failed" but my card was charged.',
        timestamp: '2023-06-10T16:20:00',
      }
    ]
  },
  {
    id: 'TICKET-005',
    subject: 'Shipping delay',
    customer: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    status: 'pending',
    priority: 'medium',
    created: '2023-06-09',
    messages: [
      {
        sender: 'customer',
        content: 'My order #ORD-005 is showing as "shipped" for 5 days now but the tracking hasn\'t updated. Is there a delay?',
        timestamp: '2023-06-09T11:10:00',
      },
      {
        sender: 'admin',
        content: 'I apologize for the inconvenience. Let me check with our shipping department and get back to you as soon as possible.',
        timestamp: '2023-06-09T13:30:00',
      }
    ]
  }
];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const HelpCenterTab = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  const filteredTickets = selectedTab === 'all' 
    ? supportTickets 
    : supportTickets.filter(ticket => ticket.status === selectedTab);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    // In a real app, you would send this to your API
    console.log('Sending message:', newMessage, 'for ticket:', selectedTicket.id);
    
    // For now, just simulate adding the message to the UI
    setSelectedTicket({
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          sender: 'admin',
          content: newMessage,
          timestamp: new Date().toISOString(),
        }
      ]
    });
    
    setNewMessage('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">Help Center</h1>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto max-h-[full]">
        {/* Ticket List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Support Tickets</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickets..."
                  className="w-full pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <div className="px-6 pt-2 pb-0">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                    <TabsTrigger value="open" className="flex-1">Open</TabsTrigger>
                    <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
                    <TabsTrigger value="resolved" className="flex-1">Resolved</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value={selectedTab} className="mt-0">
                  <div className="max-h-[500px] overflow-y-auto">
                    {filteredTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium dark:text-gray-300">{ticket.subject}</span>
                          <Badge variant="outline" className={getStatusBadgeClass(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <UserCircle className="mr-1 h-3 w-3" />
                          <span>{ticket.customer}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(ticket.created)}
                          </span>
                          <Badge variant="outline" className={getPriorityBadgeClass(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="md:col-span-2">
          {selectedTicket ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2 border-b dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getStatusBadgeClass(selectedTicket.status)}>
                        {selectedTicket.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityBadgeClass(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTicket.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== 'resolved' && (
                      <Button variant="outline" size="sm" className="h-8">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                    {selectedTicket.status === 'resolved' && (
                      <Button variant="outline" size="sm" className="h-8">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserCircle className="mr-1 h-4 w-4" />
                  <span>{selectedTicket.customer} ({selectedTicket.email})</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Created on {formatDate(selectedTicket.created)}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto p-0">
                <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                  {selectedTicket.messages.map((message: any, index: number) => (
                    <div 
                      key={index}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'admin' 
                            ? 'bg-primary/10 dark:bg-primary/20 text-primary-foreground' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {message.sender === 'admin' ? 'A' : selectedTicket.customer.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {message.sender === 'admin' ? 'Admin' : selectedTicket.customer}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {selectedTicket.status !== 'resolved' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Type your reply..." 
                      className="flex-grow resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-6">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 dark:text-white">No Ticket Selected</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a ticket from the list to view details and respond.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterTab;