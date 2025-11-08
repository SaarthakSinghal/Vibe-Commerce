import { useState } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';
import { Currency } from '@/utils/currency';
import { ChevronDown } from 'lucide-react';

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' }
];

export function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCurrency = currencies.find(c => c.value === displayCurrency) || currencies[0];

  const handleSelect = (currency: Currency) => {
    setDisplayCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedCurrency.symbol}</span>
        <span>{selectedCurrency.value}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul
            className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
            role="listbox"
          >
            {currencies.map((currency) => (
              <li
                key={currency.value}
                onClick={() => handleSelect(currency.value)}
                className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  displayCurrency === currency.value
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700'
                }`}
                role="option"
                aria-selected={displayCurrency === currency.value}
              >
                <span className="text-lg">{currency.symbol}</span>
                <div className="flex-1">
                  <div className="font-medium">{currency.value}</div>
                  <div className="text-xs text-gray-500">{currency.label}</div>
                </div>
                {displayCurrency === currency.value && (
                  <div className="w-2 h-2 bg-primary-600 rounded-full" />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
