import { Product, Cart, Receipt, AddToCartInput, CheckoutInput } from '@/types/api';

const API_BASE_URL = 'http://localhost:5001/api';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error?.message || 'An error occurred');
  }

  return data.data;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await handleResponse<{ products: Product[] }>(response);
    return data.products;
  },

  async getCart(): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart`);
    const data = await handleResponse<{ cart: Cart }>(response);
    return data.cart;
  },

  async addToCart(input: AddToCartInput): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    const data = await handleResponse<{ cart: Cart }>(response);
    return data.cart;
  },

  async removeFromCart(productId: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE'
    });
    const data = await handleResponse<{ cart: Cart }>(response);
    return data.cart;
  },

  async checkout(input: CheckoutInput): Promise<Receipt> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    const data = await handleResponse<{ receipt: Receipt }>(response);
    return data.receipt;
  },

  async getOrder(orderId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/checkout/order/${orderId}`);
    const data = await handleResponse<{ order: any }>(response);
    return data.order;
  }
};
