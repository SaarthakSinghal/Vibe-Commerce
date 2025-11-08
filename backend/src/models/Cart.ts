import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true
    },
    items: {
      type: [CartItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

CartSchema.index({ userId: 1 });

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
