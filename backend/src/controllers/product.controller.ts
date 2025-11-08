import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getAllProducts();

      res.status(200).json({
        success: true,
        data: {
          products
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
