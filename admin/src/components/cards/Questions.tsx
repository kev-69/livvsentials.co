import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Search, Eye, Trash, Reply } from 'lucide-react';
import type { Question } from '@/components/tabs/sub-tabs/Reviews';

interface QuestionsCardProps {
  questions: Question[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onViewQuestion: (question: Question) => void;
  onAnswerQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  formatDate: (date: string) => string;
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'answered':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Answered</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const QuestionsCard = ({
  questions,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onViewQuestion,
  onAnswerQuestion,
  onDeleteQuestion,
  formatDate
}: QuestionsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Product Questions</CardTitle>
        <CardDescription>
          View and answer customer questions about your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by product, customer or question..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No questions found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">{question.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={question.customerAvatar || undefined} />
                          <AvatarFallback>{question.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {question.customerName}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {question.question}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={question.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(question.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onViewQuestion(question)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAnswerQuestion(question)}>
                            <Reply className="mr-2 h-4 w-4" />
                            {question.answer ? "Edit Answer" : "Answer"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => onDeleteQuestion(question.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionsCard;