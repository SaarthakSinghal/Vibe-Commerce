import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  qty: z.number().int().positive('Quantity must be a positive integer')
});

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
});

export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
