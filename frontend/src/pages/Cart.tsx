import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { CartLine } from '@/components/CartLine';
import { api } from '@/lib/api';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatMoney } from '@/utils/currency';

export function Cart() {
  const { cart, setCart } = useCartStore();
  const { displayCurrency } = useCurrencyStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const data = await api.getCart();
        setCart(data);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [setCart]);

  // fetch exchange rate from INR (source) to display currency
  const { rate, loading: rateLoading } = useExchangeRate('INR', displayCurrency);

  const convertedTotal = cart.total * rate;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started
          </p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            {cart.items.map((item) => (
              <CartLine key={item.productId} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-numeric">{rateLoading ? 'Loading...' : formatMoney(convertedTotal, displayCurrency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-200">
                  <span>Total</span>
                  <span className="font-numeric">{rateLoading ? 'Loading...' : formatMoney(convertedTotal, displayCurrency)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link to="/checkout" className="btn btn-primary text-center w-full">
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="btn btn-outline text-center w-full"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
