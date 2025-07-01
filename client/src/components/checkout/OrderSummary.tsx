import type { Cart } from '../../types/cart';

interface OrderSummaryProps {
  cart: Cart;
  totalItems: number;
  estimatedShipping: number;
  estimatedTax: number;
}

const OrderSummary = ({
  cart,
  totalItems,
  estimatedShipping,
  estimatedTax,
}: OrderSummaryProps) => {
  // Format price
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  // Calculate order total
  const orderTotal = totalItems + estimatedShipping + estimatedTax;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      
      {/* Items summary */}
      <div className="space-y-4 mb-6">
        {cart.cartItems && cart.cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-center">
              <span className="bg-gray-100 text-gray-700 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2">
                {item.quantity}
              </span>
              <span className="text-sm text-gray-600 line-clamp-1 max-w-[180px]">
                {item.product.name}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              GHS {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Cost breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-sm font-medium text-gray-900">GHS {formatPrice(totalItems)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Shipping</span>
          {estimatedShipping > 0 ? (
            <span className="text-sm font-medium text-gray-900">GHS {formatPrice(estimatedShipping)}</span>
          ) : (
            <span className="text-sm font-medium text-green-600">Free</span>
          )}
        </div>
        
        {estimatedTax > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Estimated Tax</span>
            <span className="text-sm font-medium text-gray-900">GHS {formatPrice(estimatedTax)}</span>
          </div>
        )}
      </div>
      
      {/* Total */}
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-900">Total</span>
          <span className="font-bold text-gray-900">GHS {formatPrice(orderTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;