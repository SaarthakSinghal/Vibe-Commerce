import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Receipt as ReceiptType } from '@/types/api';
import { useCurrencyStore } from '@/store/currencyStore';
import { api } from '@/lib/api';
import { Loader2, CheckCircle } from 'lucide-react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatMoney } from '@/utils/currency';

export function Receipt() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const { displayCurrency } = useCurrencyStore();
  const [receipt, setReceipt] = useState<ReceiptType | null>(
    location.state?.receipt || null
  );
  const [isLoading, setIsLoading] = useState(!location.state?.receipt);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!orderId) return;

      try {
        setIsLoading(true);
        const order = await api.getOrder(orderId);
        setReceipt(order);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!receipt) {
      fetchReceipt();
    }
  }, [orderId, receipt]);

  // fetch exchange rate from INR (source) to display currency
  const { rate, loading: rateLoading } = useExchangeRate('INR', displayCurrency);

  const formatPrice = (price: number) => {
    const convertedPrice = price * rate;
    return rateLoading ? 'Loading...' : formatMoney(convertedPrice, displayCurrency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Receipt not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the receipt you're looking for
          </p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order ID</h2>
              <p className="text-sm text-gray-600 mt-1">{receipt.orderId}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-gray-900">Date</h2>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(receipt.timestamp)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
          <div className="space-y-3">
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-numeric">{item.qty}</span> x <span className="font-numeric">{formatPrice(item.unitPrice)}</span>
                  </p>
                </div>
                <span className="font-semibold text-gray-900 font-numeric">
                  {formatPrice(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span className="font-numeric">{formatPrice(receipt.total)}</span>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="space-y-1">
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {receipt.customer.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {receipt.customer.email}
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
