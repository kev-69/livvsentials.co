import { Eye, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable: boolean;
  };
  onView: (product: any) => void;
  onEdit: (product: any) => void;
}

const ProductCard = ({ product, onView, onEdit }: ProductCardProps) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img 
          src={product.imageUrl || '/placeholder-product.jpg'} 
          alt={product.name}
          className="object-cover w-full h-full"
        />
        {!product.isAvailable && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-primary font-semibold">${product.price.toFixed(2)}</span>
          <Badge variant="outline" className="dark:border-gray-700">{product.category}</Badge>
        </div>
        <div className="mt-3 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => onView(product)} className="dark:text-gray-300 dark:hover:bg-gray-700">
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="dark:text-gray-300 dark:hover:bg-gray-700">
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;