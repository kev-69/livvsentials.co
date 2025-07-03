import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
import { Pencil, Plus, Trash, Upload, X, ZoomIn, Loader2, Save } from 'lucide-react';
import { addImageToGallery, updateGalleryImage, deleteGalleryImage } from '@/lib/api';

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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [newTag, setNewTag] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [editImageId, setEditImageId] = useState<number | null>(null);
  const [editImageData, setEditImageData] = useState<Partial<GalleryImage>>({});
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Initialize settings with default values to prevent undefined errors
  const gallerySettings = {
    images: settings?.images || [],
    tags: settings?.tags || []
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a form data object
    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt', 'New gallery image'); // Default alt text
    formData.append('tags', JSON.stringify([])); // Empty tags array
    formData.append('height', 'medium'); // Default height
    
    try {
      const response = await addImageToGallery(formData);
      
      if (response) {
        // Add new image to state
        onChange('images', [...gallerySettings.images, response.data.data]);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Delete an image
  const deleteImage = async (id: number) => {
    try {
      const response = await deleteGalleryImage(id);
      
      if (response) {
        // Remove image from state
        onChange('images', gallerySettings.images.filter(img => img.id !== id));
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setDeleteImageId(null);
    }
  };
  
  // Update image metadata
  const updateImage = async (id: number, data: Partial<GalleryImage>) => {
    try {
      // Create form data from the edit image data
      const formData = new FormData();
      if (data.alt) formData.append('alt', data.alt);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      if (data.height) formData.append('height', data.height);

      const response = await updateGalleryImage(id, formData);
      
      if (response) {
        // Update image in state
        onChange('images', gallerySettings.images.map(img => 
          img.id === id ? { ...img, ...data } : img
        ));
        toast.success('Image updated successfully');
      } else {
        toast.error('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image. Please try again.');
    } finally {
      setEditImageId(null);
      setEditImageData({});
    }
  };
  
  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (gallerySettings.tags.includes(newTag.trim().toLowerCase())) {
      toast.error('Tag already exists');
      return;
    }
    
    // Add new tag to state
    const updatedTags = [...gallerySettings.tags, newTag.trim().toLowerCase()];
    onChange('tags', updatedTags);
    
    setNewTag('');
    setIsAddingTag(false);
    toast.success('Tag added successfully');
  };
  
  // Delete a tag
  const deleteTag = (tag: string) => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Gallery Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage images, tags, and layouts for your gallery page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('gallery-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Image
          </Button>
          <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          
          <Button 
            size="sm" 
            onClick={onSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
      
      <Separator />
      
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
                <span>{tag}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-muted-foreground hover:text-destructive"
                  onClick={() => setTagToDelete(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
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
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={addTag}
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
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>
            Manage your gallery images, their tags, and display properties
          </CardDescription>
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
              <p className="text-sm text-muted-foreground mt-1">
                Upload images to display in your gallery
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('gallery-upload')?.click()}
              >
                Upload your first image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className={`relative group rounded-md overflow-hidden border ${getGridSpanClass(image.height)}`}
                >
                  {editImageId === image.id ? (
                    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-3 z-10 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Edit Image</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setEditImageId(null);
                            setEditImageData({});
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        <div>
                          <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                          <Input
                            id={`alt-${image.id}`}
                            value={editImageData.alt || ''}
                            onChange={(e) => setEditImageData({ ...editImageData, alt: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`height-${image.id}`}>Image Height</Label>
                          <Select
                            value={editImageData.height}
                            onValueChange={(value) => setEditImageData({ ...editImageData, height: value as 'tall' | 'medium' | 'short' })}
                          >
                            <SelectTrigger id={`height-${image.id}`} className="mt-1">
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
                        
                        <div>
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {gallerySettings.tags.map(tag => (
                              <Badge
                                key={tag}
                                variant={editImageData.tags?.includes(tag) ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => toggleImageTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditImageId(null);
                            setEditImageData({});
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateImage(image.id, editImageData)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover aspect-square"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                          setSelectedImage(image);
                          setShowImageModal(true);
                        }}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                        onClick={() => startEditing(image)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setDeleteImageId(image.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tags display */}
                  <div className="absolute bottom-1 left-1 right-1 p-1">
                    <div className="flex flex-wrap gap-1 text-xs">
                      {image.tags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {image.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          +{image.tags.length - 3}
                        </Badge>
                      )}
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
              This will remove the tag "{tagToDelete}" from all images. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => tagToDelete && deleteTag(tagToDelete)}
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
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image from your gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteImageId && deleteImage(deleteImageId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
          onClick={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        >
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <img 
            src={selectedImage.url} 
            alt={selectedImage.alt} 
            className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <p className="text-white font-medium">{selectedImage.alt}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedImage.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-white bg-opacity-20 backdrop-blur-sm text-white px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySettings;