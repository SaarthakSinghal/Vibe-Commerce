import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkout } from '@/pages/Checkout';
import { useCartStore } from '@/store/cartStore';

const user = userEvent.setup();

describe('Checkout', () => {
  beforeEach(() => {
    useCartStore.setState({
      cart: {
        items: [
          {
            productId: '1',
            name: 'Test Product',
            qty: 1,
            unitPrice: 99.99,
            lineTotal: 99.99,
            imageUrl: 'https://example.com/image.jpg'
          }
        ],
        total: 99.99
      }
    });
  });

  it('displays validation errors for invalid input', async () => {
    render(<Checkout />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<Checkout />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });
});
