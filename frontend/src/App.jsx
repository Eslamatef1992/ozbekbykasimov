import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthDrawer from './components/AuthDrawer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import BookTable from './pages/BookTable';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyTerms from './pages/PrivacyTerms';
import NotFound from './pages/NotFound';

// Note: Login/Register are a slide-over drawer (see AuthDrawer), not standalone
// pages - matches the Figma design where "Create Account" / "Log In" open as a
// right-side panel over whatever page you're on.

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* Checkout is open to guests too (matches "Guest Orders") - CartContext
              and Checkout.jsx branch on auth state internally instead of gating the route. */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/book-table" element={<BookTable />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-terms" element={<PrivacyTerms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AuthDrawer />
      <CartDrawer />
    </div>
  );
}
