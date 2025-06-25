import { Request, Response } from "express";
import { reviewsService } from "./reviews.service";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from "../../../utils/response";

export const reviewsController = {
  // Get all reviews
  getAllReviews: async (req: Request, res: Response) => {
    try {
      const reviews = await reviewsService.getAllReviews();
      res.status(200).json(successResponse("Reviews fetched successfully", reviews));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to fetch reviews"));
      }
    }
  },

  // Get a single review by ID
  getReviewById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const review = await reviewsService.getReviewById(id);
      res.status(200).json(successResponse("Review fetched successfully", review));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to fetch review"));
      }
    }
  },

  // Update review status
  updateReviewStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      if (!status || !['PUBLISHED', 'PENDING', 'HIDDEN'].includes(status)) {
        res.status(400).json(errorResponse("Invalid status. Must be PUBLISHED, PENDING, or HIDDEN"));
        return;
      }

      const updatedReview = await reviewsService.updateReviewStatus(id, status as 'PUBLISHED' | 'PENDING' | 'HIDDEN');
      res.status(200).json(successResponse("Review status updated successfully", updatedReview));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to update review status"));
      }
    }
  },

  // Reply to a review
  replyToReview: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      if (!reply) {
        res.status(400).json(errorResponse("Reply content is required"));
        return;
      }

      const updatedReview = await reviewsService.replyToReview(id, reply);
      res.status(200).json(successResponse("Reply added successfully", updatedReview));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to add reply"));
      }
    }
  },

  // Delete a review
  deleteReview: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await reviewsService.deleteReview(id);
      res.status(200).json(successResponse("Review deleted successfully", null));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to delete review"));
      }
    }
  },

  // Get all questions
  getAllQuestions: async (req: Request, res: Response) => {
    try {
      const questions = await reviewsService.getAllQuestions();
      res.status(200).json(successResponse("Questions fetched successfully", questions));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to fetch questions"));
      }
    }
  },

  // Get a single question by ID
  getQuestionById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const question = await reviewsService.getQuestionById(id);
      res.status(200).json(successResponse("Question fetched successfully", question));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to fetch question"));
      }
    }
  },

  // Answer a question
  answerQuestion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { answer } = req.body;

      if (!answer) {
        res.status(400).json(errorResponse("Answer content is required"));
        return;
      }

      const updatedQuestion = await reviewsService.answerQuestion(id, answer);
      res.status(200).json(successResponse("Question answered successfully", updatedQuestion));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to answer question"));
      }
    }
  },

  // Delete a question
  deleteQuestion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await reviewsService.deleteQuestion(id);
      res.status(200).json(successResponse("Question deleted successfully", null));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to delete question"));
      }
    }
  },
  
  // Get review statistics
  getReviewStats: async (req: Request, res: Response) => {
    try {
      const stats = await reviewsService.getReviewStats();
      res.status(200).json(successResponse("Review statistics fetched successfully", stats));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse("Failed to fetch review statistics"));
      }
    }
  }
};