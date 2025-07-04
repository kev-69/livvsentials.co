import { useState, useEffect } from 'react';
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
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { X, Plus, Upload, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import { gallery } from '@/lib/api';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  tags: string[];
  height: 'tall' | 'medium' | 'short';
}

interface GallerySettings {
  images: GalleryImage[];
  tags: string[];
}

interface GallerySettingsProps {
  settings: GallerySettings;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

const heightOptions = [
  { value: 'tall', label: 'Tall' },
  { value: 'medium', label: 'Medium' },
  { value: 'short', label: 'Short' }
];

const GallerySettings = ({ settings, onChange, onSave, isSaving }: GallerySettingsProps) => {
  const [newTag, setNewTag] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [tagToEdit, setTagToEdit] = useState<{oldTag: string, newTag: string} | null>(null);
  const [editImageId, setEditImageId] = useState<number | null>(null);
  const [editImageData, setEditImageData] = useState<Partial<GalleryImage>>({});
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    image: null as File | null,
    alt: '',
    tags: [] as string[],
    height: 'medium' as 'tall' | 'medium' | 'short'
  });
  
  // Initialize settings with default values to prevent undefined errors
  const gallerySettings = {
    images: settings?.images || [],
    tags: settings?.tags || []
  };
  
  // Load data from backend
  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        const tags = await gallery.getTags();
        const items = await gallery.getGalleryItems();
        
        onChange('tags', tags);
        onChange('images', items);
      } catch (error) {
        console.error('Error loading gallery data:', error);
        toast.error('Failed to load gallery data');
      }
    };
    
    loadGalleryData();
  }, []);
  
  // Add a new tag
  const addTag = async () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (gallerySettings.tags.includes(newTag.trim().toLowerCase())) {
      toast.error('Tag already exists');
      return;
    }
    
    setIsLoading(true);
    try {
      await gallery.addTag(newTag.trim().toLowerCase());
      
      // Add new tag to state
      const updatedTags = [...gallerySettings.tags, newTag.trim().toLowerCase()];
      onChange('tags', updatedTags);
      
      setNewTag('');
      setIsAddingTag(false);
      toast.success('Tag added successfully');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a tag
  const deleteTag = async (tag: string) => {
    setIsLoading(true);
    try {
      await gallery.removeTag(tag);
      
      // Remove tag from all images
      const updatedImages = gallerySettings.images.map(img => ({
        ...img,
        tags: img.tags.filter(t => t !== tag)
      }));
      
      // Remove tag from tags list
      const updatedTags = gallerySettings.tags.filter(t => t !== tag);
      
      onChange('images', updatedImages);
      onChange('tags', updatedTags);
      
      setTagToDelete(null);
      toast.success('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Edit/Update a tag
  const startEditTag = (tag: string) => {
    setTagToEdit({ oldTag: tag, newTag: tag });
  };
  
  const updateTag = async () => {
    if (!tagToEdit) return;
    if (!tagToEdit.newTag.trim()) {
      toast.error('Tag cannot be empty');
      return;
    }
    
    if (tagToEdit.oldTag === tagToEdit.newTag) {
      setTagToEdit(null);
      return;
    }
    
    // Check if new tag already exists
    if (gallerySettings.tags.includes(tagToEdit.newTag.trim().toLowerCase()) && 
        tagToEdit.oldTag !== tagToEdit.newTag.trim().toLowerCase()) {
      toast.error('Tag already exists');
      return;
    }
    
    setIsLoading(true);
    try {
      await gallery.editTag(tagToEdit.oldTag, tagToEdit.newTag.trim().toLowerCase());
      
      // Update tag in all images
      const updatedImages = gallerySettings.images.map(img => ({
        ...img,
        tags: img.tags.map(t => t === tagToEdit.oldTag ? tagToEdit.newTag.trim().toLowerCase() : t)
      }));
      
      // Update tag in tags list
      const updatedTags = gallerySettings.tags.map(t => 
        t === tagToEdit.oldTag ? tagToEdit.newTag.trim().toLowerCase() : t
      );
      
      onChange('images', updatedImages);
      onChange('tags', updatedTags);
      
      setTagToEdit(null);
      toast.success('Tag updated successfully');
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error('Failed to update tag');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter images based on selected tag
  const filteredImages = activeFilter === 'all' 
    ? gallerySettings.images 
    : gallerySettings.images.filter(img => img.tags.includes(activeFilter));
  
  // Get grid span class based on image height
  const getGridSpanClass = (height: string) => {
    switch (height) {
      case 'tall':
        return 'row-span-2';
      case 'short':
        return 'row-span-1';
      case 'medium':
      default:
        return '';
    }
  };
  
  // Handle editing an image
  const startEditing = (image: GalleryImage) => {
    setEditImageId(image.id);
    setEditImageData({
      alt: image.alt,
      tags: [...image.tags],
      height: image.height
    });
  };
  
  // Handle tag selection for an image
  const toggleImageTag = (tag: string) => {
    if (!editImageData.tags) return;
    
    const updatedTags = editImageData.tags.includes(tag)
      ? editImageData.tags.filter(t => t !== tag)
      : [...editImageData.tags, tag];
    
    setEditImageData({ ...editImageData, tags: updatedTags });
  };
  
  // Toggle tag selection for new item
  const toggleNewItemTag = (tag: string) => {
    const updatedTags = newItemData.tags.includes(tag)
      ? newItemData.tags.filter(t => t !== tag)
      : [...newItemData.tags, tag];
    
    setNewItemData({ ...newItemData, tags: updatedTags });
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewItemData({ ...newItemData, image: e.target.files[0] });
    }
  };
  
  // Add new gallery item
  const addGalleryItem = async () => {
    if (!newItemData.image) {
      toast.error('Please select an image');
      return;
    }
    
    if (!newItemData.alt.trim()) {
      toast.error('Please provide alt text');
      return;
    }
    
    if (newItemData.tags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', newItemData.image);
      formData.append('alt', newItemData.alt);
      formData.append('tags', JSON.stringify(newItemData.tags));
      formData.append('height', newItemData.height);
      
      const newItem = await gallery.addToGallery(formData);
      
      // Update state with new item
      onChange('images', [...gallerySettings.images, newItem]);
      
      setShowAddItemModal(false);
      setNewItemData({
        image: null,
        alt: '',
        tags: [],
        height: 'medium'
      });
      
      toast.success('Gallery item added successfully');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast.error('Failed to add gallery item');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete gallery item
  const deleteGalleryItem = async (id: number) => {
    setIsLoading(true);
    try {
      await gallery.deleteGalleryItem(id.toString());
      
      // Update state by removing the deleted item
      onChange('images', gallerySettings.images.filter(img => img.id !== id));
      
      setDeleteImageId(null);
      toast.success('Gallery item deleted successfully');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Failed to delete gallery item');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle>Tags Management</CardTitle>
          <CardDescription>
            Create and manage tags to categorize your gallery images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {gallerySettings.tags.map(tag => (
              <div key={tag} className="flex items-center gap-1 bg-secondary/20 px-3 py-1 rounded-full">
                {tagToEdit && tagToEdit.oldTag === tag ? (
                  <Input
                    value={tagToEdit.newTag}
                    onChange={(e) => setTagToEdit({ ...tagToEdit, newTag: e.target.value })}
                    className="h-6 w-24"
                    onKeyDown={(e) => e.key === 'Enter' && updateTag()}
                    autoFocus
                  />
                ) : (
                  <span>{tag}</span>
                )}
                
                {tagToEdit && tagToEdit.oldTag === tag ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={updateTag}
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4"
                      onClick={() => setTagToEdit(null)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-muted-foreground hover:text-primary"
                      onClick={() => startEditTag(tag)}
                      disabled={isLoading}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-muted-foreground hover:text-destructive"
                      onClick={() => setTagToDelete(tag)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            
            {isAddingTag ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="h-8 w-40"
                  placeholder="New tag..."
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={addTag}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setIsAddingTag(false);
                    setNewTag('');
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setIsAddingTag(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Gallery Images */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gallery Items</CardTitle>
            <CardDescription>
              Manage your gallery, their tags, and display properties
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowAddItemModal(true)}
            className="ml-auto"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Gallery
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            {gallerySettings.tags.map(tag => (
              <Button
                key={tag}
                variant={activeFilter === tag ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
          
          {/* Images Grid */}
          {gallerySettings.images.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No images yet</h3>
              <p className="text-muted-foreground mt-2">
                Add images to your gallery by clicking the "Add to Gallery" button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map(image => (
                <div 
                  key={image.id} 
                  className={`relative rounded-lg overflow-hidden border border-border ${getGridSpanClass(image.height)}`}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => startEditing(image)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => setDeleteImageId(image.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="text-white text-sm mb-1">{image.alt}</p>
                      <div className="flex flex-wrap gap-1">
                        {image.tags.map(tag => (
                          <span key={tag} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Tag Confirmation Dialog */}
      <AlertDialog open={!!tagToDelete} onOpenChange={() => setTagToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the tag "{tagToDelete}" and remove it from all associated images.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => tagToDelete && deleteTag(tagToDelete)}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Image Confirmation Dialog */}
      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image from your gallery.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteImageId && deleteGalleryItem(deleteImageId)}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Gallery Item Modal */}
      <AlertDialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Add to Gallery</AlertDialogTitle>
            <AlertDialogDescription>
              Upload an image and provide details for your gallery item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="gallery-image">Image</Label>
              <div className="flex items-center gap-2">
                {newItemData.image ? (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border border-border">
                    <img 
                      src={URL.createObjectURL(newItemData.image)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 bg-black/60 text-white hover:bg-black/80"
                      onClick={() => setNewItemData({ ...newItemData, image: null })}
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
                value={newItemData.alt}
                onChange={(e: any) => setNewItemData({ ...newItemData, alt: e.target.value })}
                className="resize-none"
                rows={2}
              />
            </div>
            
            {/* Image Height */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="image-height">Height</Label>
              <Select 
                value={newItemData.height} 
                onValueChange={(value) => setNewItemData({ ...newItemData, height: value as 'tall' | 'medium' | 'short' })}
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
                {gallerySettings.tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tags available. Create tags first.</p>
                ) : (
                  gallerySettings.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1.5">
                      <Checkbox 
                        id={`tag-${tag}`}
                        checked={newItemData.tags.includes(tag)}
                        onCheckedChange={() => toggleNewItemTag(tag)}
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
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={addGalleryItem}
              disabled={isLoading || !newItemData.image || !newItemData.alt.trim() || newItemData.tags.length === 0}
            >
              {isLoading ? 'Adding...' : 'Add to Gallery'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GallerySettings;