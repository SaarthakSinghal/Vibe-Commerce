import { create } from 'zustand';
import { Cart, CartItem, Product } from '@/types/api';

interface CartStore {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getItemCount: () => number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: { items: [], total: 0 },
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getItemCount: () => {
    const { cart } = get();
    return cart.items.reduce((count, item) => count + item.qty, 0);
  },

  addItem: (product) => {
    const { cart } = get();
    const existingItem = cart.items.find((item) => item.productId === product._id);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map((item) =>
        item.productId === product._id
          ? { ...item, qty: item.qty + 1, lineTotal: item.unitPrice * (item.qty + 1) }
          : item
      );
    } else {
      newItems = [
        ...cart.items,
        {
          productId: product._id,
          name: product.name,
          qty: 1,
          unitPrice: product.price,
          lineTotal: product.price,
          imageUrl: product.imageUrl
        }
      ];
    }

    const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    set({ cart: { items: newItems, total } });
  },

  removeItem: (productId) => {
    const { cart } = get();
    const newItems = cart.items.filter((item) => item.productId !== productId);
    const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    set({ cart: { items: newItems, total } });
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
      return;
    }

    const { cart } = get();
    const newItems = cart.items.map((item) =>
      item.productId === productId
        ? { ...item, qty, lineTotal: item.unitPrice * qty }
        : item
    );
    const total = newItems.reduce((sum, item) => sum + item.lineTotal, 0);
    set({ cart: { items: newItems, total } });
  },

  clearCart: () => set({ cart: { items: [], total: 0 } })
}));
