import { Router } from "express";
import { orderController } from "./order.contoller";
import { validateToken } from "../../../middlewares/user.middleware";

const router = Router();

router.get("/", 
    validateToken,
    orderController.getUserOrders
);

router.get("/:orderId", 
    validateToken,
    orderController.getOrderById
);

export const orderRoutes = router;