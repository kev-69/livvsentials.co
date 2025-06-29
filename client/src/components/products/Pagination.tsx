interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  
  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <button 
        key={1} 
        onClick={() => onPageChange(1)}
        className={`px-3 py-2 rounded-md ${
          currentPage === 1 
            ? 'bg-primary text-white' 
            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        1
      </button>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push(<span key="ellipsis1" className="px-3 py-2">...</span>);
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= currentPage + 1 && i >= currentPage - 1) {
        pages.push(
          <button 
            key={i} 
            onClick={() => onPageChange(i)}
            className={`px-3 py-2 rounded-md ${
              currentPage === i 
                ? 'bg-primary text-white' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis2" className="px-3 py-2">...</span>);
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button 
          key={totalPages} 
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-2 rounded-md ${
            currentPage === totalPages 
              ? 'bg-primary text-white' 
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };
  
  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center space-x-1">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md border border-gray-300 ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        
        {renderPageNumbers()}
        
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md border border-gray-300 ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;