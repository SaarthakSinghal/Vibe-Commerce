import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  qty: z.number().int().positive('Quantity must be a positive integer')
});

export const deleteFromCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  cartItems: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().positive()
      })
    )
    .min(1, 'Cart must not be empty')
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type DeleteFromCartInput = z.infer<typeof deleteFromCartSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
