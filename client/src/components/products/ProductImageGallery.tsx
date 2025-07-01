import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  onImageClick: (image: string) => void;
}

const ProductImageGallery = ({ images, productName, onImageClick }: ProductImageGalleryProps) => {
  return (
    <div>
      {images && images.length > 0 ? (
        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[500px]">
          {/* First image - larger, spans 2x2 */}
          {images.length > 0 && (
            <motion.div
              key="image-0"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 relative overflow-hidden rounded-lg border border-gray-500"
            >
              <div 
                className="group cursor-pointer h-full" 
                onClick={() => onImageClick(images[0])}
              >
                <img 
                  src={images[0]} 
                  alt={`${productName} - view 1`} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Second image - top right */}
          {images.length > 1 && (
            <motion.div
              key="image-1"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="col-start-3 row-start-1 relative overflow-hidden rounded-lg border border-gray-500"
            >
              <div 
                className="group cursor-pointer h-full" 
                onClick={() => onImageClick(images[1])}
              >
                <img 
                  src={images[1]} 
                  alt={`${productName} - view 2`} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Third image - middle right */}
          {images.length > 2 && (
            <motion.div
              key="image-2"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="col-start-3 row-start-2 relative overflow-hidden rounded-lg border border-gray-500"
            >
              <div 
                className="group cursor-pointer h-full" 
                onClick={() => onImageClick(images[2])}
              >
                <img 
                  src={images[2]} 
                  alt={`${productName} - view 3`} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Fourth image - bottom left */}
          {images.length > 3 && (
            <motion.div
              key="image-3"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="row-start-3 relative overflow-hidden rounded-lg border border-gray-500"
            >
              <div 
                className="group cursor-pointer h-full" 
                onClick={() => onImageClick(images[3])}
              >
                <img 
                  src={images[3]} 
                  alt={`${productName} - view 4`} 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Fifth image - bottom right, spans 2x1 */}
          {images.length > 4 && (
            <motion.div
              key="image-4"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-start-3 relative overflow-hidden rounded-lg border border-gray-500"
            >
              <div 
                className="group cursor-pointer h-full" 
                onClick={() => onImageClick(images[4])}
              >
                <img 
                  src={images[4]} 
                  alt={`${productName} - view 5`} 
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
              </div>
            </motion.div>
          )}
          
          {/* Placeholder for missing images */}
          {images.length < 5 && (
            <>
              {images.length === 0 && (
                <div className="col-span-2 row-span-2 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              {images.length <= 1 && (
                <div className="col-start-3 row-start-1 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              {images.length <= 2 && (
                <div className="col-start-3 row-start-2 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              {images.length <= 3 && (
                <div className="row-start-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              {images.length <= 4 && (
                <div className="col-span-2 row-start-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg w-full aspect-square flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;