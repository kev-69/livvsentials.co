import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Trash, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AppearanceSettingsProps {
  settings: {
    siteBanner: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    fonts: {
      body: string;
      heading: string;
    }
  };
  onChange: (key: string, value: any) => void;
}

const CLOUDINARY_UPLOAD_PRESET = 'livssentials-banners';
const CLOUDINARY_CLOUD_NAME = 'dxykzipbv';
const commonFonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Sora', value: 'Sora' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Text Me One', value: 'Text Me One' },
  { name: 'Julius Sans One', value: 'Julius Sans One' }
];

const AppearanceSettings = ({ settings, onChange }: AppearanceSettingsProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  
  // Default color values
  const colors = {
    primaryColor: settings.primaryColor || '#414276',
    secondaryColor: settings.secondaryColor || '#9883c9',
    accentColor: settings.accentColor || '#742f52',
    textColor: settings.textColor || '#272626',
    darkBg: '#1F2937',
    darkText: '#F3F4F6'
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      if (response.data && response.data.secure_url) {
        onChange('siteBanner', response.data.secure_url);
        toast.success('Banner uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      uploadToCloudinary(file);
    }
  };

  const handleFontChange = (type: 'body' | 'heading', value: string) => {
    onChange('fonts', {
      ...settings.fonts,
      [type]: value
    });
  };

  useEffect(() => {
    // Get selected fonts or defaults
    const headingFont = settings.fonts?.heading || 'Inter';
    const bodyFont = settings.fonts?.body || 'Roboto';
    
    // Create link elements for Google Fonts
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}&family=${bodyFont.replace(' ', '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      // Clean up
      document.head.removeChild(link);
    };
  }, [settings.fonts?.heading, settings.fonts?.body]);

  return (
    <div className="space-y-6">
      {/* Banner Upload Section */}
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Site Banner</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Upload your site banner. This will appear at the top of your website.
                Recommended size: 1200×200px.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('banner-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              
              {settings.siteBanner && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onChange('siteBanner', '')}
                  className="text-destructive"
                  disabled={uploading}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          {settings.siteBanner ? (
            <div className="border rounded-md overflow-hidden">
              <img 
                src={settings.siteBanner}
                alt="Site Banner" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/1200x200?text=Banner+Preview';
                }}
              />
            </div>
          ) : (
            <div className="border rounded-md flex items-center justify-center h-32 bg-muted">
              <p className="text-sm text-muted-foreground">No banner uploaded</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Fonts Section */}
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Typography</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="heading-font">Heading Font</Label>
            <Select 
              value={settings.fonts?.heading} 
              onValueChange={(value) => handleFontChange('heading', value)}
            >
              <SelectTrigger id="heading-font">
                <SelectValue placeholder="Select heading font" />
              </SelectTrigger>
              <SelectContent>
                {commonFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Used for headings and titles throughout your site
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body-font">Body Font</Label>
            <Select 
              value={settings.fonts?.body || 'Roboto'} 
              onValueChange={(value) => handleFontChange('body', value)}
            >
              <SelectTrigger id="body-font">
                <SelectValue placeholder="Select body font" />
              </SelectTrigger>
              <SelectContent>
                {commonFonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Used for paragraph text and general content
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Theme Colors */}
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Brand Colors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-color" className="block mb-2">Primary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: colors.primaryColor }}
                />
                <Input 
                  id="primary-color" 
                  type="color"
                  value={colors.primaryColor}
                  onChange={(e) => onChange('primaryColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Used for buttons, links, and primary actions</p>
            </div>
            
            <div>
              <Label htmlFor="secondary-color" className="block mb-2">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: colors.secondaryColor }}
                />
                <Input 
                  id="secondary-color" 
                  type="color"
                  value={colors.secondaryColor}
                  onChange={(e) => onChange('secondaryColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Used for secondary elements and accents</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="accent-color" className="block mb-2">Accent Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: colors.accentColor }}
                />
                <Input 
                  id="accent-color" 
                  type="color"
                  value={colors.accentColor}
                  onChange={(e) => onChange('accentColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Used for highlights and special elements</p>
            </div>
            
            <div>
              <Label htmlFor="text-color" className="block mb-2">Text Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: colors.textColor }}
                />
                <Input 
                  id="text-color" 
                  type="color"
                  value={colors.textColor}
                  onChange={(e) => onChange('textColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Main text color for light mode</p>
            </div>
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-6 border dark:border-gray-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Theme and Font Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Light mode preview */}
            <div className="p-3 sm:p-4 bg-white border rounded-md shadow-sm overflow-hidden">
              <h4 className="text-sm font-medium mb-3" style={{ color: colors.textColor }}>Light Mode</h4>
              
              <div style={{ color: colors.textColor }}>
                <h5 
                  className="font-bold text-lg sm:text-xl" 
                  style={{ 
                    color: colors.textColor, 
                    fontFamily: settings.fonts?.heading || 'Inter'
                  }}
                >
                  SAMPLE HEADING
                </h5>
                <p 
                  className="text-xs sm:text-sm mb-3"
                  style={{ 
                    fontFamily: settings.fonts?.body || 'Roboto'
                  }}
                >
                  This is how your text will appear on light backgrounds.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Button size="sm" className="text-white text-xs" style={{ backgroundColor: colors.primaryColor, borderColor: colors.primaryColor }}>
                    Primary
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" style={{ color: colors.primaryColor, borderColor: colors.primaryColor }}>
                    Outline
                  </Button>
                </div>
                
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: colors.primaryColor }}></div>
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: colors.secondaryColor }}></div>
                <div className="h-2 rounded-full" style={{ backgroundColor: colors.accentColor }}></div>
              </div>
            </div>
            
            {/* Dark mode preview */}
            <div className="p-3 sm:p-4 rounded-md shadow-sm overflow-hidden" style={{ backgroundColor: colors.darkBg }}>
              <h4 className="text-sm font-medium mb-3" style={{ color: colors.darkText }}>Dark Mode</h4>
              
              <div style={{ color: colors.darkText }}>
                <h5 
                  className="font-bold text-lg sm:text-xl" 
                  style={{ 
                    color: colors.darkText, 
                    fontFamily: settings.fonts?.heading || 'Inter'
                  }}
                >
                  SAMPLE HEADING
                </h5>
                <p 
                  className="text-xs sm:text-sm mb-3"
                  style={{ fontFamily: settings.fonts?.body || 'Roboto' }}
                >
                  This is how your text will appear on dark backgrounds.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Button size="sm" className="text-white text-xs" style={{ backgroundColor: colors.primaryColor, borderColor: colors.primaryColor }}>
                    Primary
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs" style={{ color: colors.primaryColor, borderColor: colors.primaryColor, backgroundColor: 'transparent' }}>
                    Outline
                  </Button>
                </div>
                
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: colors.primaryColor }}></div>
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: colors.secondaryColor }}></div>
                <div className="h-2 rounded-full" style={{ backgroundColor: colors.accentColor }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;