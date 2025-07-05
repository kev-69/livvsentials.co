import { MapPin } from 'lucide-react';
import type { Cart } from '../../types/cart';
import type { Address } from '../../types/user';

interface ReviewStepProps {
  cart: Cart;
  shippingAddress: Address | null;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const ReviewStep = ({
  cart,
  shippingAddress,
  isLoading,
  onPrevious,
  onNext,
}: ReviewStepProps) => {
  // Format price
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.cartItems.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  };
    
  // Use cartItems directly
  const items = cart.cartItems || [];
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Review Your Order</h2>
      
      {/* Shipping Address Summary */}
      {shippingAddress && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> Shipping Address
          </h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600 mt-1">{shippingAddress.streetName}</p>
            <p className="text-sm text-gray-600">
              {shippingAddress.city}, {shippingAddress.region} {shippingAddress.postalCode}
            </p>
            <p className="text-sm text-gray-600 mt-1">{shippingAddress.phone}</p>
          </div>
        </div>
      )}
      
      {/* Order Items Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Order Items</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {item.product.productImages && item.product.productImages.length > 0 ? (
                          <img
                            src={item.product.productImages[0]}
                            alt={item.product.name}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {item.product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    GHS {formatPrice(item.product.salePrice || item.product.price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                    GHS {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                  Subtotal
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  GHS {formatPrice(calculateSubtotal())}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Order Note */}
      <div className="mb-6">
        <p className="text-sm text-gray-700">
          By placing your order, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4">
        <button
          type="button"
          onClick={onPrevious}
          className="mt-3 sm:mt-0 w-full sm:w-auto py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          Back to Shipping
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto py-3 px-6 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
          disabled={isLoading}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;