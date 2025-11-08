import request from 'supertest';
import app from '../src/server';

describe('Product API', () => {
  describe('GET /api/products', () => {
    it('should return products array', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('products');
      expect(Array.isArray(response.body.data.products)).toBe(true);
      expect(response.body.data.products.length).toBeGreaterThan(0);
    });

    it('should have valid product structure', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const product = response.body.data.products[0];
      expect(product).toHaveProperty('_id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('imageUrl');
      expect(product).toHaveProperty('description');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
    });
  });
});
