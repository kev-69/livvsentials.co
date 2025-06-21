import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Reply, Trash } from 'lucide-react';
import type { Question } from '@/components/tabs/sub-tabs/Reviews';

interface ViewQuestionProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnswer: () => void;
  onDelete: (questionId: string) => void;
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

const ViewQuestion = ({ 
  question,
  open,
  onOpenChange,
  onAnswer,
  onDelete,
  formatDate
}: ViewQuestionProps) => {
  if (!question) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
          <DialogDescription>
            View the full details of this customer question
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{question.productName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.customerAvatar || undefined} />
                  <AvatarFallback>{question.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">{question.customerName}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{formatDate(question.createdAt)}</span>
              </div>
            </div>
            <StatusBadge status={question.status} />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-1">Question:</h4>
            <p className="text-gray-700 dark:text-gray-300">{question.question}</p>
          </div>
          
          {question.answer && (
            <div className="bg-blue-50 dark:bg-gray-800 p-3 rounded-md border-l-4 border-blue-400">
              <h4 className="text-sm font-medium mb-1">Your Answer:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{question.answer}</p>
              <p className="text-xs text-gray-500 mt-1">Answered on {formatDate(question.updatedAt)}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onAnswer}
          >
            <Reply className="mr-2 h-4 w-4" />
            {question.answer ? "Edit Answer" : "Answer"}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(question.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewQuestion;