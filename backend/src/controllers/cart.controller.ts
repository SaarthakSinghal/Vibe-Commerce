import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/mockUser.middleware';
import { CartService } from '../services/cart.service';
import { addToCartSchema, deleteFromCartSchema } from '../schemas/validation.schemas';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const cart = await CartService.getCart(userId);

      res.status(200).json({
        success: true,
        data: {
          cart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { productId, qty } = addToCartSchema.parse(req.body);

      const cart = await CartService.addToCart(userId, productId, qty);

      res.status(201).json({
        success: true,
        data: {
          cart
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { productId } = deleteFromCartSchema.parse({
        productId: req.params.productId
      });

      const cart = await CartService.removeFromCart(userId, productId);

      res.status(200).json({
        success: true,
        data: {
          cart
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
