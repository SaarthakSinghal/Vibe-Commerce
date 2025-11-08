import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { CartService } from './cart.service';
import { Types } from 'mongoose';
import { randomBytes } from 'crypto';

export interface CheckoutItem {
  productId: string;
  qty: number;
}

export interface ReceiptItem {
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Receipt {
  orderId: string;
  total: number;
  timestamp: string;
  items: ReceiptItem[];
  customer: {
    name: string;
    email: string;
  };
}

export class OrderService {
  static async createOrder(
    userId: string,
    name: string,
    email: string,
    cartItems: CheckoutItem[]
  ): Promise<Receipt> {
    const productIds = cartItems.map((item) => item.productId);
    const products = await Product.find({
      _id: { $in: productIds }
    }).lean();

    if (products.length !== cartItems.length) {
      throw new Error('Some products not found');
    }

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    const orderItems = cartItems.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      return {
        productId: new Types.ObjectId(item.productId),
        name: product.name,
        qty: item.qty,
        unitPrice: product.price,
        lineTotal: product.price * item.qty
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const orderId = randomBytes(16).toString('hex');

    await Order.create({
      orderId,
      userId,
      items: orderItems,
      total,
      customer: { name, email }
    });

    await CartService.clearCart(userId);

    const receiptItems: ReceiptItem[] = orderItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal
    }));

    return {
      orderId,
      total,
      timestamp: new Date().toISOString(),
      items: receiptItems,
      customer: { name, email }
    };
  }

  static async getOrderById(orderId: string): Promise<any> {
    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}
