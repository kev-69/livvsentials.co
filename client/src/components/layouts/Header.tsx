import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Section 1: Logo (Left) */}
          <div className="flex-shrink-0 w-1/3 flex justify-start">
            <Link to="/" className="text-xl font-bold">
              LIVSSENTIALS
            </Link>
          </div>

          {/* Section 2: Navigation Links (Center) - Hidden on mobile */}
          <nav className="hidden md:flex w-1/3 justify-center">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="text-gray-900 hover:text-gray-600 font-medium">
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-900 hover:text-gray-600 font-medium">
                  SHOP
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-900 hover:text-gray-600 font-medium">
                  GALLERY
                </Link>
              </li>
            </ul>
          </nav>

          {/* Section 3: Icons (Right) */}
          <div className="w-1/3 flex items-center justify-end space-x-3">
            {/* Wishlist Icon - Redirects to auth if not logged in */}
            <Link
              to={isAuthenticated ? "/wishlist" : "/auth?redirect=/wishlist"}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Icon - Always accessible */}
            <button
              onClick={toggleCart}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <Link
              to={isAuthenticated ? "/account" : "/auth?redirect=/account"}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu button - Only visible on mobile */}
            <div className="md:hidden">
              <button
                type="button"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Dropdown for nav links */}
        {mobileMenuOpen && (
          <div className="space-y-1 pb-3 pt-2 md:hidden border-t border-gray-200" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              SHOP
            </Link>
            <Link
              to="/gallery"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              GALLERY
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                SIGN OUT
              </button>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                SIGN IN
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;