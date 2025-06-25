import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Message {
  id: number | string;
  type: string;
  recipient: string;
  status: 'delivered' | 'failed' | 'pending';
  sentAt: string;
  credits: number;
}

interface RecentMessagesCardProps {
  messages: Message[];
  formatDate: (dateString: string) => string;
}

const RecentMessagesCard = ({ messages, formatDate }: RecentMessagesCardProps) => {
  return (
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
              {messages.map((message) => (
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
  );
};

export default RecentMessagesCard;