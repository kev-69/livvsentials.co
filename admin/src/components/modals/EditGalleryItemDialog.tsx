import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button";
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
import { gallery } from '@/lib/api';
import { toast } from 'sonner';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  tags: string[];
  height: 'tall' | 'medium' | 'short';
}

interface EditGalleryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: string[];
  imageToEdit: GalleryImage | null;
  onItemUpdated: (updatedItem: GalleryImage) => void;
}

const heightOptions = [
  { value: 'tall', label: 'Tall' },
  { value: 'medium', label: 'Medium' },
  { value: 'short', label: 'Short' }
];

export function EditGalleryItemDialog({ 
  open, 
  onOpenChange, 
  tags, 
  imageToEdit, 
  onItemUpdated 
}: EditGalleryItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [itemData, setItemData] = useState<{
    alt: string;
    tags: string[];
    height: 'tall' | 'medium' | 'short';
  }>({
    alt: '',
    tags: [],
    height: 'medium'
  });
  
  // Initialize edit form when image changes
  useEffect(() => {
    if (imageToEdit) {
      setItemData({
        alt: imageToEdit.alt,
        tags: [...imageToEdit.tags],
        height: imageToEdit.height
      });
    }
  }, [imageToEdit]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    const updatedTags = itemData.tags.includes(tag)
      ? itemData.tags.filter(t => t !== tag)
      : [...itemData.tags, tag];
    
    setItemData({ ...itemData, tags: updatedTags });
  };
  
  // Update gallery item
  const updateGalleryItem = async () => {
    if (!imageToEdit) return;
    
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
      formData.append('alt', itemData.alt);
      formData.append('tags', JSON.stringify(itemData.tags));
      formData.append('height', itemData.height);
      
      await gallery.updateGalleryItem(formData, imageToEdit.id.toString());
      
      // First update the state and show toast
      onItemUpdated({
        ...imageToEdit,
        alt: itemData.alt,
        tags: itemData.tags,
        height: itemData.height
      });
      
      toast.success('Gallery item updated successfully');
      
      // Then close the modal after a slight delay to ensure toast is visible
      setTimeout(() => {
        onOpenChange(false);
      }, 300);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      toast.error('Failed to update gallery item');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!imageToEdit) return null;
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing when not loading
        if (!isLoading) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
          <DialogDescription>
            Update the details for this gallery item.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Image Preview */}
          <div className="w-full flex justify-center mb-4">
            <div className="w-48 h-48 rounded-md overflow-hidden border border-border">
              <img 
                src={imageToEdit.url} 
                alt={imageToEdit.alt} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Alt Text */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="edit-alt-text">Alt Text</Label>
            <Textarea
              id="edit-alt-text"
              placeholder="Describe this image for accessibility..."
              value={itemData.alt}
              onChange={(e: any) => setItemData({ ...itemData, alt: e.target.value })}
              className="resize-none"
              rows={2}
            />
          </div>
          
          {/* Image Height */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="edit-image-height">Height</Label>
            <Select 
              value={itemData.height} 
              onValueChange={(value) => setItemData({ ...itemData, height: value as 'tall' | 'medium' | 'short' })}
            >
              <SelectTrigger id="edit-image-height">
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
                      id={`edit-tag-${tag}`}
                      checked={itemData.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`edit-tag-${tag}`} className="text-sm cursor-pointer">
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
            onClick={updateGalleryItem}
            disabled={isLoading || !itemData.alt.trim() || itemData.tags.length === 0}
          >
            {isLoading ? 'Updating...' : 'Update Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}