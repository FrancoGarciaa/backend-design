import { Router } from "express";
import passport from "passport";
import {
addProductToCart,
purchaseCart,
updateProductQuantity,
deleteProductFromCart,
deleteCart
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/:cid/products/:pid", passport.authenticate("jwt", { session: false }), addProductToCart);

router.put("/:cid/products/:pid", passport.authenticate("jwt", { session: false }), updateProductQuantity);

router.delete("/:cid/products/:pid", passport.authenticate("jwt", { session: false }), deleteProductFromCart);

router.delete("/:cid", passport.authenticate("jwt", { session: false }), deleteCart);

router.post("/:cid/purchase", passport.authenticate("jwt", { session: false }), purchaseCart);

export default router;