import { Router } from "express";
import { reviewsController } from "./reviews.controller";

const router = Router();

// Reviews endpoints
router.get("/reviews", reviewsController.getAllReviews);
router.get("/reviews/stats", reviewsController.getReviewStats);
router.get("/reviews/:id", reviewsController.getReviewById);
router.patch("/reviews/:id/status", reviewsController.updateReviewStatus);
router.post("/reviews/:id/reply", reviewsController.replyToReview);
router.delete("/reviews/:id", reviewsController.deleteReview);

// Questions endpoints
router.get("/questions", reviewsController.getAllQuestions);
router.get("/questions/:id", reviewsController.getQuestionById);
router.post("/questions/:id/answer", reviewsController.answerQuestion);
router.delete("/questions/:id", reviewsController.deleteQuestion);

export { router as reviewsRoutes };