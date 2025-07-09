import { useEffect, useState } from 'react';
import { FullPageLoader } from '../ui/BrandedLoader';

interface StepTransitionProps {
  loading: boolean;
  onComplete: () => void;
  message?: string;
}

const StepTransition: React.FC<StepTransitionProps> = ({
  loading,
  onComplete,
  message = 'Processing...'
}) => {
  const [showLoader, setShowLoader] = useState(false);
  
  useEffect(() => {
    if (loading) {
      setShowLoader(true);
      
      // Use a timeout to show the loader for at least 2 seconds
      const timer = setTimeout(() => {
        setShowLoader(false);
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, onComplete]);
  
  if (!showLoader) return null;
  
  return <FullPageLoader animation="bounce" message={message} />;
};

export default StepTransition;