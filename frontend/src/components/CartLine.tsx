import { CartItem } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatMoney } from '@/utils/currency';

interface CartLineProps {
  item: CartItem;
}

export function CartLine({ item }: CartLineProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { displayCurrency } = useCurrencyStore();

  // fetch exchange rate from INR (source) to display currency
  const { rate, loading: rateLoading } = useExchangeRate('INR', displayCurrency);

  const handleUpdateQuantity = async (newQty: number) => {
    setIsUpdating(true);
    try {
      updateQuantity(item.productId, newQty);
      if (newQty <= 0) {
        await api.removeFromCart(item.productId);
      } else {
        await api.addToCart({ productId: item.productId, qty: newQty });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      removeItem(item.productId);
      await api.removeFromCart(item.productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  const unitPrice = item.unitPrice * rate;
  const lineTotal = item.lineTotal * rate;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">
          {rateLoading ? 'Loading...' : <span className="font-numeric">{`${formatMoney(unitPrice, displayCurrency)} each`}</span>}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdateQuantity(item.qty - 1)}
          disabled={isUpdating}
          className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium font-numeric">{item.qty}</span>
        <button
          onClick={() => handleUpdateQuantity(item.qty + 1)}
          disabled={isUpdating}
          className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="w-24 text-right">
        <div className="font-semibold text-gray-900 font-numeric">
          {rateLoading ? 'Loading...' : formatMoney(lineTotal, displayCurrency)}
        </div>
      </div>
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
      >
        {isUpdating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
