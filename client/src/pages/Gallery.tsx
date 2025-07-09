import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import type { GalleryImage } from '../types/platform';
import { get } from '../lib/api';
import { FullPageLoader } from '../components/ui/BrandedLoader';

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      setLoading(true);
      try {
        // Fetch from API
          const response = await get('/settings/gallery');
          const data = response.data.settingValue.images;

          setGallery(data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch gallery images:', error);
          setLoading(false);
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 100);
        }
      };

      fetchGalleryImages();
    }, []);
  
  // Get all unique tags for filter options
  const allTags = ['all', ...Array.from(new Set(gallery.flatMap(img => img.tags)))];

  // Filter images based on selected tag
  const filteredImages = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(img => img.tags.includes(activeFilter));

  // Open image modal
  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  // Determine grid span class based on image height
  const getGridSpanClass = (height: string) => {
    switch (height) {
      case 'tall':
        return 'row-span-3';
      case 'short':
        return 'row-span-1';
      case 'medium':
        return 'row-span-2';
      default:
        return 'row-span-3 md:row-span-1';
    }
  };

  if (isLoading) {
    return <FullPageLoader animation="wave" />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
            <p className="text-lg text-gray-300">
              Explore our latest collections and inspirational lifestyle images.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 -top-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Filter Tags */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleFilterChange(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tag 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div 
                key={index} 
                className="animate-pulse bg-gray-200 rounded-lg aspect-square"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-min gap-4">
            <AnimatePresence>
              {filteredImages.map(image => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className={`relative overflow-hidden rounded-lg ${getGridSpanClass(image.height)}`}
                >
                  <div 
                    className="group cursor-pointer h-full" 
                    onClick={() => openModal(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3">
                          <ZoomIn className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-wrap gap-1">
                        {image.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs bg-white bg-opacity-20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No images found for this filter.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              View All Images
            </button>
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Social Share */}
              {/* <div className="absolute top-4 left-4 z-10 flex space-x-2">
                <a 
                  href={`https://www.instagram.com/sharer/sharer.php?u=${selectedImage.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div> */}
              
              {/* Image */}
              <img 
                src={selectedImage.url} 
                alt={selectedImage.alt} 
                className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-white font-medium">{selectedImage.alt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedImage.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-white bg-opacity-20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;