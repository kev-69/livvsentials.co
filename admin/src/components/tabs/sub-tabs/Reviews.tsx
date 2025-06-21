import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MessageSquare, Star } from 'lucide-react';

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
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  rating: number;
  title: string;
  content: string;
  status: 'published' | 'pending' | 'hidden';
  createdAt: string;
  updatedAt: string;
  reply: string | null;
  images: string[];
}

export interface Question {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  question: string;
  status: 'answered' | 'pending';
  createdAt: string;
  updatedAt: string;
  answer: string | null;
}

// Mock data for reviews
const mockReviews: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: 'Premium Leather Handbag',
    customerId: 'cust-101',
    customerName: 'Emma Thompson',
    customerAvatar: null,
    rating: 5,
    title: 'Absolutely stunning quality!',
    content: 'This handbag exceeded all my expectations. The leather is buttery soft, the stitching is perfect, and it looks even better in person. Worth every penny!',
    status: 'published',
    createdAt: '2025-06-10T14:30:00Z',
    updatedAt: '2025-06-10T14:30:00Z',
    reply: null,
    images: ['https://placehold.co/100x100/png']
  },
  {
    id: 'rev-002',
    productId: 'prod-002',
    productName: 'Organic Cotton T-Shirt',
    customerId: 'cust-102',
    customerName: 'James Wilson',
    customerAvatar: null,
    rating: 2,
    title: 'Disappointing quality',
    content: 'The fabric feels cheap and the stitching started to come apart after just one wash. Not worth the price at all.',
    status: 'pending',
    createdAt: '2025-06-15T09:45:00Z',
    updatedAt: '2025-06-15T09:45:00Z',
    reply: null,
    images: []
  },
  {
    id: 'rev-003',
    productId: 'prod-003',
    productName: 'Stainless Steel Water Bottle',
    customerId: 'cust-103',
    customerName: 'Sophia Garcia',
    customerAvatar: null,
    rating: 4,
    title: 'Great bottle but lid could be better',
    content: 'I love the bottle - it keeps my water cold for hours. The only issue is the lid design could be improved for easier cleaning.',
    status: 'published',
    createdAt: '2025-06-05T11:20:00Z',
    updatedAt: '2025-06-07T16:45:00Z',
    reply: 'Thank you for your feedback! We\'re working on an improved lid design for our next version.',
    images: []
  }
];

// Mock data for questions
const mockQuestions: Question[] = [
  {
    id: 'q-001',
    productId: 'prod-001',
    productName: 'Premium Leather Handbag',
    customerId: 'cust-110',
    customerName: 'David Chen',
    customerAvatar: null,
    question: 'Does this handbag have a shoulder strap or is it only a handle?',
    status: 'answered',
    createdAt: '2025-06-12T10:30:00Z',
    updatedAt: '2025-06-13T14:15:00Z',
    answer: 'Yes, this handbag comes with both a handle and a detachable shoulder strap for versatile wearing options.'
  },
  {
    id: 'q-002',
    productId: 'prod-002',
    productName: 'Organic Cotton T-Shirt',
    customerId: 'cust-111',
    customerName: 'Anna Johnson',
    customerAvatar: null,
    question: 'Is this t-shirt true to size or should I order a size up?',
    status: 'pending',
    createdAt: '2025-06-16T09:20:00Z',
    updatedAt: '2025-06-16T09:20:00Z',
    answer: null
  }
];

const ReviewsTab = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
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
  const handleReplySubmit = () => {
    if (!selectedReview || !replyText.trim()) return;
    
    setReviews(reviews.map(review => 
      review.id === selectedReview.id 
        ? { ...review, reply: replyText, updatedAt: new Date().toISOString() }
        : review
    ));
    
    toast.success("Reply posted successfully");
    setReplyText("");
    setIsReplyDialogOpen(false);
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
  const handleAnswerSubmit = () => {
    if (!selectedQuestion || !answerText.trim()) return;
    
    setQuestions(questions.map(question => 
      question.id === selectedQuestion.id 
        ? { 
            ...question, 
            answer: answerText, 
            status: 'answered', 
            updatedAt: new Date().toISOString() 
          }
        : question
    ));
    
    toast.success("Answer posted successfully");
    setAnswerText("");
    setIsAnswerDialogOpen(false);
  };
  
  // Handle updating review status
  const handleUpdateReviewStatus = (reviewId: string, newStatus: 'published' | 'pending' | 'hidden') => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus, updatedAt: new Date().toISOString() }
        : review
    ));
    
    toast.success(`Review ${newStatus === 'published' ? 'published' : newStatus === 'hidden' ? 'hidden' : 'updated'} successfully`);
    setIsViewReviewDialogOpen(false);
  };
  
  // Handle deleting a review
  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    toast.success("Review deleted successfully");
  };
  
  // Handle deleting a question
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
    toast.success("Question deleted successfully");
    setIsViewQuestionDialogOpen(false);
  };
  
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Reviews & Questions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage customer reviews and questions about your products
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="reviews" className="data-[state=active]:bg-primary/10">
            <Star className="h-4 w-4 mr-2" />
            Product Reviews
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-primary/10">
            <MessageSquare className="h-4 w-4 mr-2" />
            Product Questions
          </TabsTrigger>
        </TabsList>
        
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