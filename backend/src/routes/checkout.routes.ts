import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';
import { validate } from '../middleware/validate.middleware';
import { checkoutSchema } from '../schemas/validation.schemas';

const router = Router();

router.post('/', validate(checkoutSchema), CheckoutController.checkout);
router.get('/order/:orderId', CheckoutController.getOrder);

export default router;
