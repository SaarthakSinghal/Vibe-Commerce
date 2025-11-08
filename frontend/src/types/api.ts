export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AddToCartInput {
  productId: string;
  qty: number;
}

export interface CheckoutInput {
  name: string;
  email: string;
  cartItems: Array<{ productId: string; qty: number }>;
}
