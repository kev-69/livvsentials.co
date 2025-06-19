import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ViewProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any | null;
  onEdit: () => void;
  onDelete: () => void;
}

const ViewProduct = ({ open, onOpenChange, product, onEdit, onDelete }: ViewProductProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-square w-full">
            <img 
              src={product.imageUrl || '/placeholder-product.jpg'} 
              alt={product.name}
              className="object-cover w-full h-full rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h4 className="text-sm text-muted-foreground">Name</h4>
              <p className="dark:text-gray-200">{product.name}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">Price</h4>
              <p className="dark:text-gray-200">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">Category</h4>
              <p className="dark:text-gray-200">{product.category}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground">Status</h4>
              <Badge variant="outline" className={product.isAvailable ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}>
                {product.isAvailable ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          
          {product.description && (
            <div>
              <h4 className="text-sm text-muted-foreground">Description</h4>
              <p className="text-sm dark:text-gray-300">{product.description}</p>
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
      </DialogContent>
    </Dialog>
  );
};

export default ViewProduct;