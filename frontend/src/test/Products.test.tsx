import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Products } from '@/pages/Products';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    getProducts: vi.fn()
  }
}));

const mockProducts = [
  {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    imageUrl: 'https://example.com/image.jpg',
    description: 'Test description'
  }
];

describe('Products', () => {
  it('renders products after loading', async () => {
    vi.mocked(api.getProducts).mockResolvedValue(mockProducts);

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    vi.mocked(api.getProducts).mockImplementation(
      () => new Promise(() => {})
    );

    render(<Products />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    vi.mocked(api.getProducts).mockRejectedValue(new Error('Failed to load'));

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
