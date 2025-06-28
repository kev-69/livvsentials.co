import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

// Define product interface
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

const Home = () => {
  const { colors, fonts, images, isLoading: themeLoading } = useContext(ThemeContext);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock featured products - will be replaced with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts([
        {
          id: '1',
          name: 'Classic White T-Shirt',
          slug: 'classic-white-t-shirt',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
          id: '2',
          name: 'Everyday Jeans',
          slug: 'everyday-jeans',
          price: 59.99,
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
          id: '3',
          name: 'Minimalist Watch',
          slug: 'minimalist-watch',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
          id: '4',
          name: 'Leather Backpack',
          slug: 'leather-backpack',
          price: 119.99,
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[500px]" 
        style={{ backgroundImage: `url(${images.banner})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Essentials for Everyday Living</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Discover our curated collection of products designed to enhance your lifestyle.</p>
            <Link
              to="/products"
              className="btn-primary inline-block px-8 py-3 rounded-md hover:bg-opacity-90 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: any) => (
                <Link to={`/products/${product.slug}`} key={product.id} className="group">
                  <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-700">${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary inline-block px-8 py-3 rounded-md hover:bg-opacity-90 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Quality Materials</h3>
              <p className="text-gray-600">We source only the finest materials for our products to ensure longevity and comfort.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Orders are processed and shipped within 24 hours for a seamless shopping experience.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Shop with confidence knowing your payment and personal information is always protected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;