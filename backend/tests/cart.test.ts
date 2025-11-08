import request from 'supertest';
import app from '../src/server';
import mongoose from 'mongoose';

describe('Cart API', () => {
  let productId: string;

  beforeAll(async () => {
    const response = await request(app).get('/api/products');
    if (response.body.data.products.length > 0) {
      productId = response.body.data.products[0]._id;
    }
  });

  describe('GET /api/cart', () => {
    it('should return empty cart initially', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.cart).toHaveProperty('items', []);
      expect(response.body.data.cart).toHaveProperty('total', 0);
    });
  });

  describe('POST /api/cart', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId,
          qty: 2
        })
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.cart.items).toHaveLength(1);
      expect(response.body.data.cart.items[0].qty).toBe(2);
      expect(response.body.data.cart.total).toBeGreaterThan(0);
    });

    it('should increment quantity for existing item', async () => {
      await request(app)
        .post('/api/cart')
        .send({
          productId,
          qty: 1
        })
        .expect(201);

      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body.data.cart.items[0].qty).toBe(3);
    });

    it('should return validation error for invalid data', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: '',
          qty: -1
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/cart/:productId', () => {
    it('should remove item from cart', async () => {
      await request(app)
        .post('/api/cart')
        .send({
          productId,
          qty: 1
        })
        .expect(201);

      const response = await request(app)
        .delete(`/api/cart/${productId}`)
        .expect(200);

      expect(response.body.data.cart.items).toHaveLength(0);
      expect(response.body.data.cart.total).toBe(0);
    });
  });
});
