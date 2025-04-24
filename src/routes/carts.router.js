import { Router } from 'express';
import { addProductToCart, purchaseCart } from '../controllers/carts.controller.js';
import passport from "passport";

const router = Router();

router.post('/:cid/products/:pid', passport.authenticate("jwt", { session: false }), addProductToCart);


export default router;