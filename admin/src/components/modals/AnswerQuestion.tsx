import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import type { Question } from '@/components/tabs/sub-tabs/Reviews';

interface AnswerQuestionProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answerText: string;
  setAnswerText: (text: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const AnswerQuestion = ({ 
  question,
  open,
  onOpenChange,
  answerText,
  setAnswerText,
  onSubmit,
  isSubmitting = false
}: AnswerQuestionProps) => {
  if (!question) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{question.answer ? "Edit Answer" : "Answer Question"}</DialogTitle>
          <DialogDescription>
            {question.answer 
              ? "Update your answer to this customer question" 
              : "Provide an answer to this customer question"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 my-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.customerAvatar || undefined} />
                <AvatarFallback>{question.customerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{question.customerName}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              <span className="font-medium">Question: </span>
              {question.question}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Your Answer</Label>
            <Textarea 
              id="answer"
              placeholder="Write your answer here..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={5}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting || !answerText.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              question.answer ? "Update Answer" : "Post Answer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerQuestion;