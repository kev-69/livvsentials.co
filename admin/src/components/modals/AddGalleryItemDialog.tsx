import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Image as ImageIcon } from 'lucide-react';
import { gallery } from '@/lib/api';
import { toast } from 'sonner';

interface AddGalleryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: string[];
  onItemAdded: (newItem: any) => void;
}

const heightOptions = [
  { value: 'tall', label: 'Tall' },
  { value: 'medium', label: 'Medium' },
  { value: 'short', label: 'Short' }
];

export function AddGalleryItemDialog({ open, onOpenChange, tags, onItemAdded }: AddGalleryItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [itemData, setItemData] = useState({
    image: null as File | null,
    alt: '',
    tags: [] as string[],
    height: 'medium' as 'tall' | 'medium' | 'short'
  });
  
  // Toggle tag selection for new item
  const toggleTag = (tag: string) => {
    const updatedTags = itemData.tags.includes(tag)
      ? itemData.tags.filter(t => t !== tag)
      : [...itemData.tags, tag];
    
    setItemData({ ...itemData, tags: updatedTags });
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setItemData({ ...itemData, image: e.target.files[0] });
    }
  };
  
  // Reset form data
  const resetForm = () => {
    setItemData({
      image: null,
      alt: '',
      tags: [],
      height: 'medium'
    });
  };
  
  // Add new gallery item
  const addGalleryItem = async () => {
    if (!itemData.image) {
      toast.error('Please select an image');
      return;
    }
    
    if (!itemData.alt.trim()) {
      toast.error('Please provide alt text');
      return;
    }
    
    if (itemData.tags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', itemData.image);
      formData.append('alt', itemData.alt);
      formData.append('tags', JSON.stringify(itemData.tags));
      formData.append('height', itemData.height);
      
      const newItem = await gallery.addToGallery(formData);
      
      // Update state and show toast first
      onItemAdded(newItem);
      toast.success('Gallery item added successfully');
      
      // Reset form
      resetForm();
      
      // Close modal after a short delay to ensure toast is visible
      setTimeout(() => {
        onOpenChange(false);
      }, 300);
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast.error('Failed to add gallery item');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing when not loading
        if (!isLoading) {
          if (!isOpen) {
            resetForm();
          }
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          // Prevent closing when loading
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add to Gallery</DialogTitle>
          <DialogDescription>
            Upload an image and provide details for your gallery item.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Image Upload */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="gallery-image">Image</Label>
            <div className="flex items-center gap-2">
              {itemData.image ? (
                <div className="relative w-24 h-24 rounded-md overflow-hidden border border-border">
                  <img 
                    src={URL.createObjectURL(itemData.image)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6 bg-black/60 text-white hover:bg-black/80"
                    onClick={() => setItemData({ ...itemData, image: null })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-24 h-24 rounded-md border border-dashed border-border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="gallery-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 1200x800px, max 5MB
                </p>
              </div>
            </div>
          </div>
          
          {/* Alt Text */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Textarea
              id="alt-text"
              placeholder="Describe this image for accessibility..."
              value={itemData.alt}
              onChange={(e: any) => setItemData({ ...itemData, alt: e.target.value })}
              className="resize-none"
              rows={2}
            />
          </div>
          
          {/* Image Height */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="image-height">Height</Label>
            <Select 
              value={itemData.height} 
              onValueChange={(value) => setItemData({ ...itemData, height: value as 'tall' | 'medium' | 'short' })}
            >
              <SelectTrigger id="image-height">
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent>
                {heightOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tags */}
          <div className="grid w-full items-center gap-1.5">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags available. Create tags first.</p>
              ) : (
                tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1.5">
                    <Checkbox 
                      id={`tag-${tag}`}
                      checked={itemData.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={addGalleryItem}
            disabled={isLoading || !itemData.image || !itemData.alt.trim() || itemData.tags.length === 0}
          >
            {isLoading ? 'Adding...' : 'Add to Gallery'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}