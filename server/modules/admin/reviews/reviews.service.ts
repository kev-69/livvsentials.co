import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";

export const reviewsService = {
  // Get all reviews with product and user details
  async getAllReviews() {
    try {
      const reviews = await prisma.review.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reviews.map(review => ({
        id: review.id,
        productId: review.productId,
        productName: review.product.name,
        productSlug: review.product.slug,
        customerId: review.userId,
        customerName: `${review.user.firstName} ${review.user.lastName}`,
        customerEmail: review.user.email,
        rating: review.rating,
        title: review.title,
        content: review.content,
        status: review.status.toLowerCase(),
        reply: review.reply,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      }));
    } catch (error) {
      logger.error("Error fetching reviews:", error);
      throw new AppError("Failed to fetch reviews", 500);
    }
  },

  // Get a single review by ID
  async getReviewById(reviewId: string) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!review) {
        throw new AppError("Review not found", 404);
      }

      return {
        id: review.id,
        productId: review.productId,
        productName: review.product.name,
        productSlug: review.product.slug,
        customerId: review.userId,
        customerName: `${review.user.firstName} ${review.user.lastName}`,
        customerEmail: review.user.email,
        rating: review.rating,
        title: review.title,
        content: review.content,
        status: review.status.toLowerCase(),
        reply: review.reply,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error fetching review:", error);
      throw new AppError("Failed to fetch review", 500);
    }
  },

  // Update review status (publish, hide, etc.)
  async updateReviewStatus(reviewId: string, status: 'PUBLISHED' | 'PENDING' | 'HIDDEN') {
    try {
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: { status },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return {
        id: review.id,
        productId: review.productId,
        productName: review.product.name,
        productSlug: review.product.slug,
        customerId: review.userId,
        customerName: `${review.user.firstName} ${review.user.lastName}`,
        customerEmail: review.user.email,
        rating: review.rating,
        title: review.title,
        content: review.content,
        status: review.status.toLowerCase(),
        reply: review.reply,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    } catch (error) {
      logger.error("Error updating review status:", error);
      throw new AppError("Failed to update review status", 500);
    }
  },

  // Add or update reply to a review
  async replyToReview(reviewId: string, reply: string) {
    try {
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: { reply },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return {
        id: review.id,
        productId: review.productId,
        productName: review.product.name,
        productSlug: review.product.slug,
        customerId: review.userId,
        customerName: `${review.user.firstName} ${review.user.lastName}`,
        customerEmail: review.user.email,
        rating: review.rating,
        title: review.title,
        content: review.content,
        status: review.status.toLowerCase(),
        reply: review.reply,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    } catch (error) {
      logger.error("Error replying to review:", error);
      throw new AppError("Failed to update review reply", 500);
    }
  },

  // Delete a review
  async deleteReview(reviewId: string) {
    try {
      await prisma.review.delete({
        where: { id: reviewId },
      });

      return { success: true };
    } catch (error) {
      logger.error("Error deleting review:", error);
      throw new AppError("Failed to delete review", 500);
    }
  },

  // Get all questions with product and user details
  async getAllQuestions() {
    try {
      const questions = await prisma.question.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return questions.map(question => ({
        id: question.id,
        productId: question.productId,
        productName: question.product.name,
        productSlug: question.product.slug,
        customerId: question.userId,
        customerName: `${question.user.firstName} ${question.user.lastName}`,
        customerEmail: question.user.email,
        question: question.question,
        answer: question.answer,
        status: question.status.toLowerCase(),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      }));
    } catch (error) {
      logger.error("Error fetching questions:", error);
      throw new AppError("Failed to fetch questions", 500);
    }
  },

  // Get a single question by ID
  async getQuestionById(questionId: string) {
    try {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!question) {
        throw new AppError("Question not found", 404);
      }

      return {
        id: question.id,
        productId: question.productId,
        productName: question.product.name,
        productSlug: question.product.slug,
        customerId: question.userId,
        customerName: `${question.user.firstName} ${question.user.lastName}`,
        customerEmail: question.user.email,
        question: question.question,
        answer: question.answer,
        status: question.status.toLowerCase(),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error("Error fetching question:", error);
      throw new AppError("Failed to fetch question", 500);
    }
  },

  // Answer a question
  async answerQuestion(questionId: string, answer: string) {
    try {
      const question = await prisma.question.update({
        where: { id: questionId },
        data: { 
          answer,
          status: 'ANSWERED'
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return {
        id: question.id,
        productId: question.productId,
        productName: question.product.name,
        productSlug: question.product.slug,
        customerId: question.userId,
        customerName: `${question.user.firstName} ${question.user.lastName}`,
        customerEmail: question.user.email,
        question: question.question,
        answer: question.answer,
        status: question.status.toLowerCase(),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      };
    } catch (error) {
      logger.error("Error answering question:", error);
      throw new AppError("Failed to answer question", 500);
    }
  },

  // Delete a question
  async deleteQuestion(questionId: string) {
    try {
      await prisma.question.delete({
        where: { id: questionId },
      });

      return { success: true };
    } catch (error) {
      logger.error("Error deleting question:", error);
      throw new AppError("Failed to delete question", 500);
    }
  },
  
  // Get review statistics
  async getReviewStats() {
    try {
      const totalReviews = await prisma.review.count();
      const totalQuestions = await prisma.question.count();
      
      const pendingReviews = await prisma.review.count({
        where: { status: 'PENDING' }
      });
      
      const pendingQuestions = await prisma.question.count({
        where: { status: 'PENDING' }
      });
      
      const avgRating = await prisma.review.aggregate({
        _avg: {
          rating: true
        }
      });
      
      // Get products with most reviews
      const productsWithMostReviews = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { reviews: true }
          }
        },
        orderBy: {
          reviews: {
            _count: 'desc'
          }
        },
        take: 5
      });
      
      return {
        totalReviews,
        totalQuestions,
        pendingReviews,
        pendingQuestions,
        averageRating: avgRating._avg.rating || 0,
        topReviewedProducts: productsWithMostReviews.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          reviewCount: p._count.reviews
        }))
      };
    } catch (error) {
      logger.error("Error fetching review stats:", error);
      throw new AppError("Failed to fetch review statistics", 500);
    }
  }
};