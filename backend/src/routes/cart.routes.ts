import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { validate } from '../middleware/validate.middleware';
import { addToCartSchema } from '../schemas/validation.schemas';

const router = Router();

router.get('/', CartController.getCart);
router.post('/', validate(addToCartSchema), CartController.addToCart);
router.delete('/:productId', CartController.removeFromCart);

export default router;
