const ShimmerEffect = () => {
  return (
    <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-4 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerEffect;