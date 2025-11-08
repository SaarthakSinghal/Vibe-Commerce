import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutFormData } from '@/schemas/validation';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatMoney } from '@/utils/currency';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { displayCurrency } = useCurrencyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema)
  });

  // fetch exchange rate from INR (source) to display currency
  const { rate, loading: rateLoading } = useExchangeRate('INR', displayCurrency);
  const convertedTotal = cart.total * rate;

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const receipt = await api.checkout({
        name: data.name,
        email: data.email,
        cartItems: cart.items.map((item) => ({
          productId: item.productId,
          qty: item.qty
        }))
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/receipt/${receipt.orderId}`, {
        state: { receipt }
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Your cart is empty</h2>
          <p className="text-gray-300 mb-6">
            Add some products before checking out
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
      <div className="mb-6">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-100 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Shipping Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="input"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="input"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-6 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <span className="font-numeric">
                  {`Place Order - ${rateLoading ? 'Loading...' : formatMoney(convertedTotal, displayCurrency)}`}
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-100">{item.name}</p>
                    <p className="text-gray-300">Qty: <span className="font-numeric">{item.qty}</span></p>
                  </div>
                  <span className="font-medium text-gray-100 font-numeric">
                    {rateLoading ? 'Loading...' : formatMoney(item.lineTotal * rate, displayCurrency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-100">
                <span>Total</span>
                <span className="font-numeric">{rateLoading ? 'Loading...' : formatMoney(convertedTotal, displayCurrency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
