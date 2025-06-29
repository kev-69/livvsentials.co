import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
// import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Auth from './pages/Auth';
// import OrderSuccess from './pages/OrderSuccess';

// Layout
import MainLayout from './components/layouts/MainLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {/* <CartProvider> */}
            <Router>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  {/* <Route path="/products/:slug" element={<ProductDetail />} /> */}
                  {/* <Route path="/cart" element={<Cart />} /> */}
                  {/* <Route path="/checkout" element={<Checkout />} /> */}
                  <Route path="/account" element={<Account />} />
                  <Route path="/auth" element={<Auth />} />
                  {/* <Route path="/order-success" element={<OrderSuccess />} /> */}
                </Route>
              </Routes>
            </Router>
          {/* </CartProvider> */}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;