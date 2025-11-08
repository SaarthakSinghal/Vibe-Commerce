import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cart } from '@/pages/Cart';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    getCart: vi.fn()
  }
}));

describe('Cart', () => {
  it('displays empty cart message when cart is empty', async () => {
    vi.mocked(api.getCart).mockResolvedValue({
      items: [],
      total: 0
    });

    render(<Cart />);

    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('displays cart items when cart has products', async () => {
    vi.mocked(api.getCart).mockResolvedValue({
      items: [
        {
          productId: '1',
          name: 'Test Product',
          qty: 2,
          unitPrice: 99.99,
          lineTotal: 199.98,
          imageUrl: 'https://example.com/image.jpg'
        }
      ],
      total: 199.98
    });

    render(<Cart />);

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/199\.98/)).toBeInTheDocument();
  });
});
