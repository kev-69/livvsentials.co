import { Router } from "express";
import { productController } from "./product.controller";

const router = Router();

router.get('/',
    productController.getProducts
)

router.get('/:slug',
    productController.getProductBySlug
)

export { router as productRoutes }