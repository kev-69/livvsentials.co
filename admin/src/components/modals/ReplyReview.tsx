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
import type { Review } from '@/components/tabs/sub-tabs/Reviews';

interface ReplyReviewProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmit: () => void;
}

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

const ReplyReview = ({ 
  review,
  open,
  onOpenChange,
  replyText,
  setReplyText,
  onSubmit
}: ReplyReviewProps) => {
  if (!review) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{review.reply ? "Edit Reply" : "Reply to Review"}</DialogTitle>
          <DialogDescription>
            {review.reply 
              ? "Update your response to this customer review" 
              : "Write a response to this customer review"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 my-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={review.customerAvatar || undefined} />
                  <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{review.customerName}</span>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{review.content}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reply">Your Reply</Label>
            <Textarea 
              id="reply"
              placeholder="Write your response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {review.reply ? "Update Reply" : "Post Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyReview;