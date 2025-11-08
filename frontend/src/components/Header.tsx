import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { CurrencySelector } from '@/components/CurrencySelector';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/" className="flex items-center space-x-2">
              <img src='./favicon.png' alt="Vibe Commerce" className="w-12 h-12" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Vibe Commerce</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className={`relative text-sm font-medium transition-colors ${
                location.pathname === '/cart'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <CurrencySelector />
          </nav>
        </div>
      </div>
    </header>
  );
}
