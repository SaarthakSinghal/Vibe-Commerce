import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/mockUser.middleware';
import { OrderService } from '../services/order.service';
import { checkoutSchema } from '../schemas/validation.schemas';

export class CheckoutController {
  static async checkout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { name, email, cartItems } = checkoutSchema.parse(req.body);

      const receipt = await OrderService.createOrder(userId, name, email, cartItems);

      res.status(201).json({
        success: true,
        data: {
          receipt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);

      res.status(200).json({
        success: true,
        data: {
          order
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
