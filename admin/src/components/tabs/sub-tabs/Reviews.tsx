import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageSquare, Star, Loader2 } from 'lucide-react';
import { 
  fetchReviews, 
  fetchQuestions, 
  fetchReviewStats, 
  updateReviewStatus,
  replyToReview, 
  deleteReview,
  answerQuestion,
  deleteQuestion
} from '@/lib/api';

// Import card components
import ReviewsCard from '@/components/cards/Reviews';
import QuestionsCard from '@/components/cards/Questions';

// Import modal components
import ViewReview from '@/components/modals/ViewReview';
import ReplyReview from '@/components/modals/ReplyReview';
import ViewQuestion from '@/components/modals/ViewQuestion';
import AnswerQuestion from '@/components/modals/AnswerQuestion';

// Types for reviews and questions
export interface Review {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string | null;
  rating: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reply: string | null;
  images: string[];
}

export interface Question {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string | null;
  question: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  answer: string | null;
}

export interface ReviewStats {
  totalReviews: number;
  totalQuestions: number;
  pendingReviews: number;
  pendingQuestions: number;
  averageRating: number;
  topReviewedProducts: {
    id: string;
    name: string;
    slug: string;
    reviewCount: number;
  }[];
}

const ReviewsTab = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selected items for dialogs
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [replyText, setReplyText] = useState("");
  const [answerText, setAnswerText] = useState("");
  
  // Dialog states
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [isViewReviewDialogOpen, setIsViewReviewDialogOpen] = useState(false);
  const [isViewQuestionDialogOpen, setIsViewQuestionDialogOpen] = useState(false);
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load reviews, questions and stats
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reviewsData, questionsData, statsData] = await Promise.all([
        fetchReviews(),
        fetchQuestions(),
        fetchReviewStats()
      ]);
      
      setReviews(reviewsData);
      setQuestions(questionsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading review data:", error);
      toast.error("Failed to load review data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter reviews based on search and status
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter questions based on search and status
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      question.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.question.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || question.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle viewing a review
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsViewReviewDialogOpen(true);
  };
  
  // Handle replying to a review
  const handleReplyToReview = (review: Review) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
    setIsReplyDialogOpen(true);
  };
  
  // Handle submitting a reply
  const handleReplySubmit = async () => {
    if (!selectedReview || !replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedReview = await replyToReview(selectedReview.id, replyText);
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(review => 
        review.id === selectedReview.id ? updatedReview : review
      ));
      
      toast.success("Reply posted successfully");
      setReplyText("");
      setIsReplyDialogOpen(false);
    } catch (error) {
      console.error("Error replying to review:", error);
      toast.error("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle viewing a question
  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsViewQuestionDialogOpen(true);
  };
  
  // Handle answering a question
  const handleAnswerQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setAnswerText(question.answer || "");
    setIsAnswerDialogOpen(true);
  };
  
  // Handle submitting an answer
  const handleAnswerSubmit = async () => {
    if (!selectedQuestion || !answerText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedQuestion = await answerQuestion(selectedQuestion.id, answerText);
      
      // Update the questions list with the updated question
      setQuestions(questions.map(question => 
        question.id === selectedQuestion.id ? updatedQuestion : question
      ));
      
      toast.success("Answer posted successfully");
      setAnswerText("");
      setIsAnswerDialogOpen(false);
    } catch (error) {
      console.error("Error answering question:", error);
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle updating review status
  const handleUpdateReviewStatus = async (reviewId: string, newStatus: 'published' | 'pending' | 'hidden') => {
    try {
      const updatedReview = await updateReviewStatus(reviewId, newStatus);
      
      // Update the reviews list with the updated review
      setReviews(reviews.map(review => 
        review.id === reviewId ? updatedReview : review
      ));
      
      toast.success(`Review ${newStatus === 'published' ? 'published' : newStatus === 'hidden' ? 'hidden' : 'updated'} successfully`);
      setIsViewReviewDialogOpen(false);
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update review status. Please try again.");
    }
  };
  
  // Handle deleting a review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      
      // Remove the deleted review from the reviews list
      setReviews(reviews.filter(review => review.id !== reviewId));
      
      toast.success("Review deleted successfully");
      setIsViewReviewDialogOpen(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };
  
  // Handle deleting a question
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId);
      
      // Remove the deleted question from the questions list
      setQuestions(questions.filter(question => question.id !== questionId));
      
      toast.success("Question deleted successfully");
      setIsViewQuestionDialogOpen(false);
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading reviews and questions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Reviews & Questions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer reviews and questions about your products
        </p>
        
        {/* {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Reviews</p>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
              <p className="text-2xl font-bold">{stats.totalQuestions}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        )} */}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="border-b dark:border-gray-800">
          <TabsList className="h-auto bg-transparent p-0 w-full grid grid-cols-2 rounded-none">
            <TabsTrigger 
              value="reviews" 
              className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
            >
              <div className="flex items-center justify-center">
                <Star className="h-4 w-4 mr-2" />
                <span>Reviews</span>
                {reviews.length > 0 && (
                  <div className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                    {reviews.length}
                  </div>
                )}
              </div>
              {stats && stats.pendingReviews > 0 && (
                <div className="absolute -top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {stats.pendingReviews}
                </div>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="questions" 
              className="relative py-3 px-4 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all"
            >
              <div className="flex items-center justify-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Questions</span>
                {questions.length > 0 && (
                  <div className="ml-2 bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                    {questions.length}
                  </div>
                )}
              </div>
              {stats && stats.pendingQuestions > 0 && (
                <div className="absolute -top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {stats.pendingQuestions}
                </div>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <ReviewsCard 
            reviews={filteredReviews}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewReview={handleViewReview}
            onReplyToReview={handleReplyToReview}
            onUpdateStatus={handleUpdateReviewStatus}
            onDeleteReview={handleDeleteReview}
            formatDate={formatDate}
          />
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <QuestionsCard 
            questions={filteredQuestions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewQuestion={handleViewQuestion}
            onAnswerQuestion={handleAnswerQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <ViewReview 
        review={selectedReview}
        open={isViewReviewDialogOpen}
        onOpenChange={setIsViewReviewDialogOpen}
        onReply={() => {
          setReplyText(selectedReview?.reply || "");
          setIsViewReviewDialogOpen(false);
          setIsReplyDialogOpen(true);
        }}
        onUpdateStatus={handleUpdateReviewStatus}
        formatDate={formatDate}
      />
      
      <ReplyReview 
        review={selectedReview}
        open={isReplyDialogOpen}
        onOpenChange={setIsReplyDialogOpen}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmit={handleReplySubmit}
      />
      
      <ViewQuestion 
        question={selectedQuestion}
        open={isViewQuestionDialogOpen}
        onOpenChange={setIsViewQuestionDialogOpen}
        onAnswer={() => {
          setAnswerText(selectedQuestion?.answer || "");
          setIsViewQuestionDialogOpen(false);
          setIsAnswerDialogOpen(true);
        }}
        onDelete={handleDeleteQuestion}
        formatDate={formatDate}
      />
      
      <AnswerQuestion 
        question={selectedQuestion}
        open={isAnswerDialogOpen}
        onOpenChange={setIsAnswerDialogOpen}
        answerText={answerText}
        setAnswerText={setAnswerText}
        onSubmit={handleAnswerSubmit}
      />
    </div>
  );
};

export default ReviewsTab;