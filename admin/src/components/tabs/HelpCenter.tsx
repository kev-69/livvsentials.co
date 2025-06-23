import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  UserCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Search,
  Loader2,
  Flag,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  getTickets, 
  getTicketById, 
  addMessage, 
  updateTicketStatus, 
  updateTicketPriority,
  createTicket
} from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
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
  switch (priority.toLowerCase()) {
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
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timestamp: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const HelpCenterTab = () => {
  const { admin } = useAuth();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    customerName: '',
    customerEmail: '',
    priority: 'MEDIUM',
    initialMessage: ''
  });

  // Fetch all tickets when component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch tickets from the API
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
      // If there's a selected ticket, refresh its data
      if (selectedTicket) {
        const updatedTicket = await getTicketById(selectedTicket.id);
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load support tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tickets based on selected tab and search query
  const filteredTickets = tickets.filter(ticket => {
    // Filter by status
    const statusMatch = selectedTab === 'all' || ticket.status.toLowerCase() === selectedTab.toLowerCase();
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    setIsSubmitting(true);
    try {
      await addMessage(selectedTicket.id, { content: newMessage });
      
      // Refresh the ticket to get the updated messages
      const updatedTicket = await getTicketById(selectedTicket.id);
      setSelectedTicket(updatedTicket);
      
      // Clear the message input
      setNewMessage('');
      
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle changing ticket status
  const handleStatusChange = async (status: string) => {
    if (!selectedTicket) return;
    
    setIsChangingStatus(true);
    try {
      await updateTicketStatus(selectedTicket.id, { status });
      
      // Refresh ticket data
      const updatedTicket = await getTicketById(selectedTicket.id);
      setSelectedTicket(updatedTicket);
      
      // Also refresh the tickets list
      fetchTickets();
      
      toast.success(`Ticket status updated to ${status.toLowerCase()}`);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      toast.error('Failed to update ticket status. Please try again.');
    } finally {
      setIsChangingStatus(false);
    }
  };

  // Handle changing ticket priority
  const handlePriorityChange = async (priority: string) => {
    if (!selectedTicket) return;
    
    try {
      await updateTicketPriority(selectedTicket.id, { priority });
      
      // Refresh ticket data
      const updatedTicket = await getTicketById(selectedTicket.id);
      setSelectedTicket(updatedTicket);
      
      // Also refresh the tickets list
      fetchTickets();
      
      toast.success(`Ticket priority updated to ${priority.toLowerCase()}`);
    } catch (error) {
      console.error('Failed to update ticket priority:', error);
      toast.error('Failed to update ticket priority. Please try again.');
    }
  };

  // Handle creating a new ticket
  const handleCreateTicket = async () => {
    // Validate form
    if (!newTicketForm.subject || !newTicketForm.customerName || !newTicketForm.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newTicket = await createTicket(newTicketForm);
      
      // Reset form
      setNewTicketForm({
        subject: '',
        customerName: '',
        customerEmail: '',
        priority: 'MEDIUM',
        initialMessage: ''
      });
      
      // Close modal
      setNewTicketOpen(false);
      
      // Refresh tickets
      fetchTickets();
      
      // Select the new ticket
      setSelectedTicket(newTicket);
      
      toast.success('New ticket created successfully');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle viewing a ticket
  const handleViewTicket = async (ticketId: string) => {
    setIsLoading(true);
    try {
      const ticket = await getTicketById(ticketId);
      setSelectedTicket(ticket);
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      toast.error('Failed to load ticket details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">Help Center</h1>
        <Button onClick={() => setNewTicketOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">No tickets found</p>
                    </div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredTickets.map(ticket => (
                        <div 
                          key={ticket.id}
                          className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium dark:text-gray-300">{ticket.subject}</span>
                            <Badge variant="outline" className={getStatusBadgeClass(ticket.status)}>
                              {ticket.status.toLowerCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <UserCircle className="mr-1 h-3 w-3" />
                            <span>{ticket.customerName}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatDate(ticket.createdAt)}
                            </span>
                            <Badge variant="outline" className={getPriorityBadgeClass(ticket.priority)}>
                              {ticket.priority.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details */}
        <div className="md:col-span-2">
          {isLoading && selectedTicket ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-6">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-gray-500 dark:text-gray-400">Loading ticket details...</p>
              </CardContent>
            </Card>
          ) : selectedTicket ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2 border-b dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getStatusBadgeClass(selectedTicket.status)}>
                        {selectedTicket.status.toLowerCase()}
                      </Badge>
                      <Badge variant="outline" className={getPriorityBadgeClass(selectedTicket.priority)}>
                        {selectedTicket.priority.toLowerCase()}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTicket.ticketNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Status Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8" disabled={isChangingStatus}>
                          {isChangingStatus ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('OPEN')}
                          disabled={selectedTicket.status === 'OPEN'}
                        >
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('PENDING')}
                          disabled={selectedTicket.status === 'PENDING'}
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('RESOLVED')}
                          disabled={selectedTicket.status === 'RESOLVED'}
                        >
                          Resolved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Priority Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Flag className="mr-2 h-4 w-4" />
                          Priority
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handlePriorityChange('HIGH')}
                          disabled={selectedTicket.priority === 'HIGH'}
                          className="text-red-500"
                        >
                          High
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePriorityChange('MEDIUM')}
                          disabled={selectedTicket.priority === 'MEDIUM'}
                          className="text-yellow-500"
                        >
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePriorityChange('LOW')}
                          disabled={selectedTicket.priority === 'LOW'}
                          className="text-green-500"
                        >
                          Low
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <UserCircle className="mr-1 h-4 w-4" />
                  <span>{selectedTicket.customerName} ({selectedTicket.customerEmail})</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Created on {formatDate(selectedTicket.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-auto p-0">
                <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message: any, index: number) => (
                      <div 
                        key={index}
                        className={`flex ${message.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderType === 'ADMIN' 
                              ? 'bg-primary/10 dark:bg-primary/20 text-primary-foreground' 
                              : message.senderType === 'SYSTEM'
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 italic text-sm'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <Avatar className="h-6 w-6 mr-2">
                              {message.admin && message.admin.firstName ? (
                                <AvatarFallback>
                                  {message.admin.firstName.charAt(0)}{message.admin.lastName.charAt(0)}
                                </AvatarFallback>
                              ) : message.user && message.user.firstName ? (
                                <AvatarFallback>
                                  {message.user.firstName.charAt(0)}{message.user.lastName.charAt(0)}
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback>
                                  {message.senderType === 'SYSTEM' ? 'SYS' : '?'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span className="text-xs font-medium">
                              {message.senderType === 'ADMIN' 
                                ? message.admin 
                                  ? `${message.admin.firstName} ${message.admin.lastName}`
                                  : 'Admin'
                                : message.senderType === 'USER'
                                  ? message.user
                                    ? `${message.user.firstName} ${message.user.lastName}`
                                    : 'Customer'
                                  : 'System'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              {selectedTicket.status !== 'RESOLVED' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Type your reply..." 
                      className="flex-grow resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
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

      {/* New Ticket Dialog */}
      <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket to track customer issues or inquiries.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter ticket subject"
                value={newTicketForm.subject}
                onChange={(e) => setNewTicketForm({...newTicketForm, subject: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Customer Name
                </label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={newTicketForm.customerName}
                  onChange={(e) => setNewTicketForm({...newTicketForm, customerName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="customerEmail" className="text-sm font-medium">
                  Customer Email
                </label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter customer email"
                  value={newTicketForm.customerEmail}
                  onChange={(e) => setNewTicketForm({...newTicketForm, customerEmail: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select
                value={newTicketForm.priority}
                onValueChange={(value) => setNewTicketForm({...newTicketForm, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="initialMessage" className="text-sm font-medium">
                Initial Message (Optional)
              </label>
              <Textarea
                id="initialMessage"
                placeholder="Enter initial ticket message"
                value={newTicketForm.initialMessage}
                onChange={(e) => setNewTicketForm({...newTicketForm, initialMessage: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setNewTicketOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTicket}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Ticket</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpCenterTab;