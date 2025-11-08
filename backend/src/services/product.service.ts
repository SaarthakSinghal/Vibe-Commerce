import { Product } from '../models/Product';
import { IProduct } from '../models/Product';

interface ProductData {
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const MOCK_PRODUCTS: ProductData[] = [
  {
    name: 'Wireless Headphones Pro',
    price: 14999,
    imageUrl: 'https://images.unsplash.com/photo-1641048930621-ab5d225ae5b0?q=80',
    description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.'
  },
  {
    name: 'Smart Watch Series X',
    price: 24999,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    description: 'Feature-rich smartwatch with heart rate monitoring, GPS, and water resistance.'
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 6999,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
    description: 'Compact yet powerful speaker with 360-degree sound and 20-hour playtime.'
  },
  {
    name: 'Laptop Stand Ergonomic',
    price: 2999,
    imageUrl: 'https://images.unsplash.com/photo-1629317480872-45e07211ffd4?q=80',
    description: 'Adjustable aluminum laptop stand for better ergonomics and cooling.'
  },
  {
    name: 'USB-C Hub 7-in-1',
    price: 3499,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1761043248662-42f371ad31b4?q=80',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.'
  },
  {
    name: 'Wireless Charging Pad',
    price: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.'
  },
  {
    name: 'Mechanical Keyboard RGB',
    price: 8999,
    imageUrl: 'https://images.unsplash.com/photo-1619683322755-4545503f1afa?q=80',
    description: 'Premium mechanical keyboard with blue switches, RGB backlighting, and programmable keys.'
  },
  {
    name: '4K Webcam HD',
    price: 6499,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80',
    description: 'Professional 4K webcam with autofocus, noise reduction, and privacy cover.'
  }
];


export class ProductService {
  static async getAllProducts(): Promise<IProduct[]> {
    const count = await Product.countDocuments();

    if (count === 0) {
      await Product.insertMany(MOCK_PRODUCTS);
    }

    return Product.find().lean() as unknown as IProduct[];
  }

  static async getProductById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id).lean();
    return product as unknown as IProduct | null;
  }
}
