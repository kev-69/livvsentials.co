import { Router } from "express";
import { validateToken } from "../../../middlewares/user.middleware";
import { addressController } from "./address.contoller";

const router = Router()

router.get('/',
    validateToken,
    addressController.getUserAddress
)

router.post('/',
    validateToken,
    addressController.createAddress
)

router.delete('/:id',
    validateToken,
    addressController.deleteAddress
)

export const addressRoutes = router