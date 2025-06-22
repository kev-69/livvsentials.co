import { Router } from "express";
import { authRoutes } from "../../../../modules/admin/auth/auth.module";

import { isAdmin, validateToken } from "../../../../middlewares/admin.middleware";

import { categoryRoutes } from "../../../../modules/admin/categories/category.module";
import { userRoutes } from "../../../../modules/admin/users/user.module";
import { productRoutes } from "../../../../modules/admin/products/product.module";
import { paymentRoutes } from "../../../../modules/admin/payments/payment.module";
import { orderRoutes } from "../../../../modules/admin/orders/order.module";

const router = Router();

router.use('/',
    authRoutes
)

router.use('/', 
    validateToken,
    isAdmin,
    productRoutes
);

router.use('/',
    validateToken,
    isAdmin,
    categoryRoutes
)

router.use('/',
    validateToken,
    isAdmin,
    userRoutes
)

router.use('/',
    validateToken,
    isAdmin,
    paymentRoutes
)

router.use('/',
    validateToken,
    isAdmin,
    orderRoutes
)

export { router as adminRoutes };