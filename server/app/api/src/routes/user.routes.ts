import { Router } from 'express';
import { authRoutes } from '../../../../modules/users/auth/auth.module';
import { getSettingsRoutes } from '../../../../modules/users/platform/platform.module';
import { productRoutes } from '../../../../modules/users/products/product.module';
import { orderRoutes } from '../../../../modules/users/orders/order.module';
import { addressRoutes } from '../../../../modules/users/address/address.module';
import { wishlistRoutes } from '../../../../modules/users/wishlist/wishlist.module';
import { categoryRoutes } from '../../../../modules/users/categories/category.module';
import { cartRoutes } from '../../../../modules/users/carts/cart.module';
import { checkoutRoutes } from '../../../../modules/users/checkout/checkout.module';

const router = Router();

router.use('/auth',
    authRoutes
);

// platform routes
router.use('/settings',
    getSettingsRoutes
)

// categories routes
router.use('/categories',
    categoryRoutes
)

// product routes
router.use('/products',
    productRoutes
);

router.use('/checkout',
    checkoutRoutes
)

router.use('/orders',
    orderRoutes
);

router.use('/addresses',
    addressRoutes
)

router.use('/wishlist',
    wishlistRoutes
)

router.use('/cart',
    cartRoutes
)

export { router as userRoutes };