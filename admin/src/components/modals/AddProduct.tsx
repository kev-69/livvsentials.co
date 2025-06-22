import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addProduct } from "@/lib/api";
import { toast } from "sonner";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  salePrice: z.coerce.number().positive("Sale price must be positive").nullable().optional(),
  inStock: z.boolean(),
  stockQuantity: z.coerce.number().int().nonnegative("Stock quantity must be 0 or positive"),
  categoryId: z.string().min(1, "Please select a category"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string }[];
  onProductAdded: (productData: any) => void;
}

const AddProduct = ({ open, onOpenChange, categories, onProductAdded }: AddProductProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      salePrice: null,
      inStock: true,
      stockQuantity: 0,
      categoryId: "",
    },
  });

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Check if adding these files would exceed the limit
      if (files.length + newFiles.length > 5) {
        alert("You can only upload up to 5 images");
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Generate preview URLs
      newFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        setPreviewUrls(prev => [...prev, url]);
      });
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFiles(prev => {
      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
    
    setPreviewUrls(prev => {
      const updatedUrls = [...prev];
      URL.revokeObjectURL(updatedUrls[index]); // Clean up the URL
      updatedUrls.splice(index, 1);
      return updatedUrls;
    });
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (files.length === 0) {
        toast.error("Please upload at least one product image");
        setIsSubmitting(false);
        return;
      }
      
      // Create FormData object
      const formData = new FormData();
      
      // Add form values
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Add files
      files.forEach(file => {
        formData.append('productImages', file);
      });
      
      // Save product
      const newProduct = await addProduct(formData);
      toast.success('Product created successfully');
      
      // Notify parent component
      onProductAdded(newProduct);
      
      // Reset form and state
      form.reset();
      setFiles([]);
      setPreviewUrls(prev => {
        prev.forEach(url => URL.revokeObjectURL(url)); // Clean up URLs
        return [];
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // Display specific validation errors
        const errorMessages = error.response.data.errors.map((err: any) => 
          `${err.path.replace('body.', '')}: ${err.message}`
        ).join('\n');
        toast.error(`Validation errors:\n${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URLs when modal closes
  const handleClose = () => {
    if (!isSubmitting) {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setFiles([]);
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (GHS)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex items-center justify-between">
                         <FormLabel>Sale Price (GHS)</FormLabel>
                            <FormDescription className="text-xs">
                                Leave empty if not on sale
                            </FormDescription>
                        </div>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="inStock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Available in Stock
                      </FormLabel>
                      <FormDescription>
                        Is this product available for purchase?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Product Images</FormLabel>
                <FormDescription className="mb-2">
                  Upload at least one image for your product (maximum 5)
                </FormDescription>
                
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {previewUrls.map((url, index) => (
                    <div 
                      key={index}
                      className="relative aspect-square border rounded-md overflow-hidden group"
                    >
                      <img 
                        src={url} 
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-full object-cover" 
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {files.length < 5 && (
                    <div 
                      className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Upload Image
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You can upload up to 5 images. {5 - files.length} slots remaining.
                </p>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Product..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;