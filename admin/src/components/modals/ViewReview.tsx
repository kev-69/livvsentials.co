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
import { Reply, CheckCircle, XCircle } from 'lucide-react';
import type { Review } from '@/components/tabs/sub-tabs/Reviews';

interface ViewReviewProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: () => void;
  onUpdateStatus: (reviewId: string, newStatus: 'published' | 'pending' | 'hidden') => void;
  formatDate: (date: string) => string;
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

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'published':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Published</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
    case 'hidden':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Hidden</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ViewReview = ({ 
  review,
  open,
  onOpenChange,
  onReply,
  onUpdateStatus,
  formatDate
}: ViewReviewProps) => {
  if (!review) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            View the full details of this customer review
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{review.productName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={review.customerAvatar || undefined} />
                  <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">{review.customerName}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <StarRating rating={review.rating} />
              <StatusBadge status={review.status} />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">{review.title}</h4>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{review.content}</p>
          </div>
          
          {review.images && review.images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Review Images:</h4>
              <div className="flex gap-2 flex-wrap">
                {review.images.map((image: any, index: any) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`Review image ${index + 1}`} 
                    className="w-16 h-16 object-cover rounded-md border" 
                  />
                ))}
              </div>
            </div>
          )}
          
          {review.reply && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mt-3">
              <h4 className="text-sm font-medium mb-1">Your Reply:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{review.reply}</p>
              <p className="text-xs text-gray-500 mt-1">Replied on {formatDate(review.updatedAt)}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onReply}
            className="w-full sm:w-auto"
          >
            <Reply className="mr-2 h-4 w-4" />
            {review.reply ? "Edit Reply" : "Reply"}
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            {review.status !== 'published' && (
              <Button 
                variant="default" 
                onClick={() => onUpdateStatus(review.id, 'published')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )}
            {review.status !== 'hidden' && (
              <Button 
                variant="destructive" 
                onClick={() => onUpdateStatus(review.id, 'hidden')}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Hide
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReview;