import { useMemo, useState } from 'react';
import { Product } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Minus, Plus } from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatMoney, Currency } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  sourceCurrency?: Currency;  // currency of prices from API
}

export function ProductCard({
  product,
  sourceCurrency = 'INR',
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { cart, updateQuantity } = useCartStore();
  const { displayCurrency } = useCurrencyStore();

  // fetch & cache rate once per currency pair (hook handles TTL)
  const { rate, loading: rateLoading, error: rateError } = useExchangeRate(
    sourceCurrency,
    displayCurrency
  );

  const converted = useMemo(() => product.price * rate, [product.price, rate]);
  const priceLabel = useMemo(() => {
    // If rate is loading or error, show source currency to avoid jank
    if (rateLoading || rateError) {
      return formatMoney(product.price, sourceCurrency);
    }
    return formatMoney(converted, displayCurrency);
  }, [rateLoading, rateError, product.price, sourceCurrency, converted, displayCurrency]);

  // Check if item is already in cart
  const cartItem = cart.items.find((item) => item.productId === product._id);
  const quantity = cartItem?.qty || 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      addItem(product);
      await api.addToCart({ productId: product._id, qty: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (newQty: number) => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      updateQuantity(product._id, newQty);
      if (newQty <= 0) {
        await api.removeFromCart(product._id);
        toast.error(`${product.name} removed from cart`);
      } else {
        await api.addToCart({ productId: product._id, qty: newQty });
        if (newQty > quantity) {
          toast.success(`${product.name} added to cart`);
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="card group hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary-600">
              {priceLabel}
            </span>
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isAdding}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isAdding}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isAdding}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isAdding}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding…
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
