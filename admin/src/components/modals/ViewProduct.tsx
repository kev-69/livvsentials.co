import { useState } from "react";
import { Pencil, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any | null;
  onEdit: () => void;
  onDelete: () => void;
}

const ViewProduct = ({ open, onOpenChange, product, onEdit, onDelete }: ViewProductProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!product) return null;
  
  const images = product.productImages || product.images || [];
  
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            {/* Image carousel */}
            {images.length > 0 ? (
              <div className="relative aspect-square w-full">
                <img 
                  src={images[currentImageIndex]?.replace(/[\[\]"']/g, '')} 
                  alt={product.name}
                  className="object-cover w-full h-full rounded-md"
                />
                
                {images.length > 1 && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      {images.map((_: any, index: any) => (
                        <div 
                          key={index} 
                          className={`h-2 w-2 rounded-full ${
                            index === currentImageIndex 
                              ? "bg-white" 
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
            
            {/* Product details */}
            <div>
              <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">{product.name}</h2>
              
              <div className="mb-4">
                {product.salePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-sm line-through text-muted-foreground">
                      {formatCurrency(product.price)}
                    </span>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ml-2">
                      Sale
                    </Badge>
                  </div>
                ) : (
                  <span className="text-lg font-bold dark:text-gray-200">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Category</h4>
                  <p className="dark:text-gray-200">{product.category}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Status</h4>
                  <Badge variant="outline" className={product.inStock ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Stock Quantity</h4>
                  <p className="dark:text-gray-200">{product.stockQuantity || 0}</p>
                </div>
              </div>
              
              {product.description && (
                <div className="mb-4">
                  <h4 className="text-sm text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm dark:text-gray-300 whitespace-pre-line">{product.description}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onEdit} className="dark:border-gray-700 dark:text-gray-200">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={onDelete}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProduct;