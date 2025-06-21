import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash } from 'lucide-react';

interface AppearanceProps {
  banner: {
    mainBanner: string;
    mobileBanner: string;
    showMainBanner: boolean;
  };
  onBannerChange: (key: string, value: any) => void;
}

const Appearance = ({ banner, onBannerChange }: AppearanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner Management</CardTitle>
        <CardDescription>
          Customize your website banners and hero sections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Banner */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium dark:text-white">Main Banner</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This appears on your homepage hero section (Recommended: 1200×400px)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          
          <div className="border dark:border-gray-700 rounded-md overflow-hidden">
            <img 
              src={banner.mainBanner} 
              alt="Main Banner" 
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="show-main-banner" 
              checked={banner.showMainBanner}
              onCheckedChange={(checked) => onBannerChange('showMainBanner', checked)}
            />
            <Label htmlFor="show-main-banner">Show main banner on homepage</Label>
          </div>
        </div>

        {/* Mobile Banner */}
        <div className="pt-6 border-t dark:border-gray-700 space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium dark:text-white">Mobile Banner</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This appears on mobile devices (Recommended: 600×800px)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          
          <div className="border dark:border-gray-700 rounded-md overflow-hidden max-w-xs mx-auto">
            <img 
              src={banner.mobileBanner} 
              alt="Mobile Banner" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appearance;