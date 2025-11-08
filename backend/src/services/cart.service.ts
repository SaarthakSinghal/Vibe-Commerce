import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Types } from 'mongoose';

export interface CartItemResponse {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string;
}

export interface CartResponse {
  items: CartItemResponse[];
  total: number;
}

export class CartService {
  static async getCart(userId: string): Promise<CartResponse> {
    const cart = await Cart.findOne({ userId }).lean();

    if (!cart || cart.items.length === 0) {
      return { items: [], total: 0 };
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds }
    }).lean();

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    const items: CartItemResponse[] = cart.items.map((item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const unitPrice = product.price;
      const lineTotal = unitPrice * item.qty;

      return {
        productId: item.productId.toString(),
        name: product.name,
        qty: item.qty,
        unitPrice,
        lineTotal,
        imageUrl: product.imageUrl
      };
    });

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return { items, total };
  }

  static async addToCart(
    userId: string,
    productId: string,
    qty: number
  ): Promise<CartResponse> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].qty += qty;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        qty
      } as any);
    }

    await cart.save();

    return this.getCart(userId);
  }

  static async removeFromCart(
    userId: string,
    productId: string
  ): Promise<CartResponse> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return { items: [], total: 0 };
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return this.getCart(userId);
  }

  static async clearCart(userId: string): Promise<void> {
    await Cart.deleteOne({ userId });
  }
}
