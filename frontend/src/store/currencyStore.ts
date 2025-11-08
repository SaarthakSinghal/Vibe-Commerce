import { create } from 'zustand';
import { Currency } from '@/utils/currency';

interface CurrencyStore {
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  displayCurrency: 'INR',
  setDisplayCurrency: (currency) => set({ displayCurrency: currency })
}));
