import request from 'supertest';
import app from '../src/server';

describe('Checkout API', () => {
  let productId: string;
  let cartItems: Array<{ productId: string; qty: number }>;

  beforeAll(async () => {
    const response = await request(app).get('/api/products');
    if (response.body.data.products.length > 0) {
      productId = response.body.data.products[0]._id;
      cartItems = [{ productId, qty: 2 }];
      await request(app)
        .post('/api/cart')
        .send({ productId, qty: 2 })
        .expect(201);
    }
  });

  describe('POST /api/checkout', () => {
    it('should create order and return receipt', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          cartItems
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.receipt).toHaveProperty('orderId');
      expect(response.body.data.receipt).toHaveProperty('total');
      expect(response.body.data.receipt).toHaveProperty('timestamp');
      expect(response.body.data.receipt).toHaveProperty('items');
      expect(response.body.data.receipt).toHaveProperty('customer');
      expect(response.body.data.receipt.customer).toHaveProperty('name', 'John Doe');
      expect(response.body.data.receipt.customer).toHaveProperty('email', 'john@example.com');
    });

    it('should clear cart after checkout', async () => {
      await request(app)
        .post('/api/cart')
        .send({ productId, qty: 1 })
        .expect(201);

      await request(app)
        .post('/api/checkout')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          cartItems
        })
        .expect(201);

      const cartResponse = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(cartResponse.body.data.cart.items).toHaveLength(0);
    });

    it('should re-price items from database', async () => {
      const checkoutResponse = await request(app)
        .post('/api/checkout')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          cartItems
        })
        .expect(201);

      const productsResponse = await request(app).get('/api/products');
      const product = productsResponse.body.data.products.find(
        (p: any) => p._id === productId
      );

      const expectedTotal = product.price * 2;
      expect(checkoutResponse.body.data.receipt.total).toBe(expectedTotal);
    });

    it('should return validation error for invalid data', async () => {
      const response = await request(app)
        .post('/api/checkout')
        .send({
          name: 'X',
          email: 'invalid-email',
          cartItems: []
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
