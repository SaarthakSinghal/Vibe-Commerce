import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import dotenv from 'dotenv';

dotenv.config();

const MOCK_PRODUCTS = [
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

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-commerce';

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB ✓');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared ✓');

    // Insert mock products
    console.log('Seeding products...');
    const products = await Product.insertMany(MOCK_PRODUCTS);
    console.log(`Seeded ${products.length} products ✓`);

    // Display inserted products
    console.log('\nInserted Products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${(product.price / 100).toFixed(2)}`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    console.log('Seeding completed successfully! 🎉');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
