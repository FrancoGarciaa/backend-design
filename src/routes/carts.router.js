import { Router } from 'express';
import { addProductToCart, purchaseCart } from '../controllers/carts.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/:cid/products/:pid', authMiddleware(['user', 'admin']), addProductToCart);
router.post('/:cid/purchase', authMiddleware(['user', 'admin']), purchaseCart);

export default router;