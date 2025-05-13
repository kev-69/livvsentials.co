import { Router } from "express";
import { loginAdmin } from "./auth/auth.controller";
// categories
import { categoryController } from "./categories/category.controller";
// products
import { productController } from "./products/product.controller";
import { isAdmin } from "./admin.middleware";

// import middlewares

const router = Router();

router.post('/login',
    loginAdmin
)

// other admin routes
// categories
router.get('/categories', 
    isAdmin,
    categoryController.getCategories
);

router.post('/categories', 
    isAdmin,
    categoryController.createCategory
);

router.put('/categories/:categoryId', 
    isAdmin,
    categoryController.updateCategory
);

router.delete('/categories/:categoryId', 
    isAdmin,
    categoryController.deleteCategory
);

// products
router.get('/products',
    isAdmin,
    productController.getProducts
);

router.post('/products',
    isAdmin,
    productController.addProduct
);

router.put('/products/:productId',
    isAdmin,
    productController.updateProduct
);

router.delete('/products/:productId',
    isAdmin,
    productController.deleteProduct
);

export { router as adminRoutes };