import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Products } from '@/pages/Products';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Receipt } from '@/pages/Receipt';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <Router basename={basename}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position='bottom-right' richColors />
      </div>
    </Router>
  );
}

export default App;
