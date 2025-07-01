import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2 } from 'lucide-react';

interface ImageModalProps {
  image: string | null;
  alt: string;
  onClose: () => void;
  onShare: () => void;
}

const ImageModal = ({ image, alt, onClose, onShare }: ImageModalProps) => {
  return (
    <AnimatePresence>
      {image && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Share Button */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <button 
                onClick={onShare}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Image */}
            <img 
              src={image} 
              alt={alt} 
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;