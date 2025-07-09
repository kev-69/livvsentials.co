import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Livssentials</h1>
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="rounded-lg overflow-hidden h-96 mb-8">
            <img 
              src="/src/assets/about-hero.jpg" // Replace with your actual image path
              alt="About Livssentials" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2215&q=80";
              }}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Founded in 2022, Livssentials began with a simple mission: to provide high-quality, essential products that enhance everyday living. What started as a small passion project in Accra, Ghana has grown into a beloved brand serving customers nationwide.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our founder, Olivia, noticed a gap in the market for thoughtfully designed, durable home goods that combined functionality with beautiful aesthetics. Frustrated by having to choose between quality and style, she set out to create products that offered both without compromise.
            </p>
          </div>
        </div>
        
        {/* Mission & Values Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Livssentials, our mission is to enhance everyday living through thoughtfully designed products that combine quality, functionality, and style. We believe that well-crafted essentials can bring joy to daily routines and create harmony in your living spaces.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              We're committed to sustainable practices, ethical sourcing, and supporting local artisans whenever possible. Our goal is to create products that are not only beautiful and functional but also mindful of their impact on our planet and communities.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Quality</h3>
                  <p className="mt-1 text-gray-600">We never compromise on quality, ensuring each product meets our high standards.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Sustainability</h3>
                  <p className="mt-1 text-gray-600">We strive to minimize our environmental footprint through responsible practices.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Community</h3>
                  <p className="mt-1 text-gray-600">We support local artisans and foster a sense of connection with our customers.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Innovation</h3>
                  <p className="mt-1 text-gray-600">We continuously improve our products based on customer feedback and evolving needs.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img 
                  src="/src/assets/team-1.jpg" // Replace with actual image
                  alt="Olivia Mensah" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800">Olivia Mensah</h3>
                <p className="text-primary font-medium">Founder & CEO</p>
                <p className="mt-2 text-gray-600">
                  With a background in design and a passion for quality craftsmanship, Olivia brings vision and leadership to Livssentials.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img 
                  src="/src/assets/team-2.jpg" // Replace with actual image
                  alt="Kwame Osei" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800">Kwame Osei</h3>
                <p className="text-primary font-medium">Head of Operations</p>
                <p className="mt-2 text-gray-600">
                  Kwame ensures that all operations run smoothly, from sourcing materials to delivering the final product to our customers.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img 
                  src="/src/assets/team-3.jpg" // Replace with actual image
                  alt="Ama Darko" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800">Ama Darko</h3>
                <p className="text-primary font-medium">Creative Director</p>
                <p className="mt-2 text-gray-600">
                  With an eye for design and trends, Ama leads our product development team in creating beautiful, functional items.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "The quality of Livssentials products has exceeded my expectations. I've purchased several items for my home, and each one has been beautifully made and long-lasting. Their customer service is also exceptional!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="/src/assets/testimonial-1.jpg" // Replace with actual image
                    alt="Sarah K." 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Sarah K.</h3>
                  <p className="text-xs text-gray-500">Loyal Customer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "I appreciate Livssentials' commitment to sustainability. It's rare to find a company that genuinely cares about their environmental impact while still delivering high-quality products. I'll definitely be a customer for life!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="/src/assets/testimonial-2.jpg" // Replace with actual image
                    alt="David M." 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">David M.</h3>
                  <p className="text-xs text-gray-500">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;