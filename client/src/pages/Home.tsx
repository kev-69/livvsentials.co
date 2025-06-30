import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { images, isLoading: themeLoading } = useContext(ThemeContext);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[600px]" 
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

      {/* test hero section */}
      <section className='mt-10'>
        <h1 className='text-center text-4xl underline'>COLLECTIONS</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded-xl">
        {/* Left Large Card */}
        <div className="relative md:col-span-2 bg-[#f1f5f9] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold leading-tight mb-4">
              PACK OF THREE BASIC
            </h1>
            <h2 className='text-3xl font-thin'>Tshirts</h2>
            <a href="#" className="underline font-semibold text-sm">
              SHOP NOW
            </a>
          </div>
          <img
            src="https://res.cloudinary.com/dxykzipbv/image/upload/v1750584837/livssentials-products/ainbumtjknlntfqlynr1.avif"
            alt="Fuego Bag"
            className="h-[400px] object-contain"
          />

          {/* Arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
            <ChevronLeft size={20} />
          </button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">
            <ChevronRight size={20} />
          </button>
        </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 mt-16">
            {/* Top card */}
            <div className="relative bg-white rounded-xl p-6 flex items-center justify-between shadow">
              <div>
                <h1 className="text-2xl font-semibold">PACK OF THREE</h1>
                <h2 className='text-3xl'>Polo</h2>
                <a href="#" className="underline text-sm font-medium">
                  SHOP NOW
                </a>
              </div>
              <img
                src="https://res.cloudinary.com/dxykzipbv/image/upload/v1750584696/livssentials-products/wygf1ypnw6h9y8udosnf.jpg"
                alt="T-Shirts"
                className="h-28"
              />
            </div>

            {/* Bottom card */}
            <div className="relative bg-white rounded-xl p-6 flex items-center justify-between shadow">
            <div>
              <h1 className="text-2xl font-semibold leading-snug">
                DURABLE AND SPACIOUS
              </h1>
              <h2 className='text-3xl'>Backpacks</h2>
              <a href="#" className="underline text-sm font-medium">
                SHOP NOW
              </a>
            </div>
            <img
              src="https://res.cloudinary.com/dxykzipbv/image/upload/v1750584576/livssentials-products/ldqw8b9uonzmkopocik9.jpg"
              alt="Backpack"
              className="h-28"
            />
            </div>
          </div>
        </div>
      </section>
      

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Quality Materials</h3>
              <p className="text-gray-600">We source only the finest materials for our products to ensure longevity and comfort.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Orders are processed and shipped within 24 hours for a seamless shopping experience.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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