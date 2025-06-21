import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save,
  Globe,
  Image,
  Palette
} from 'lucide-react';

// Import card components
import Appearance from '@/components/cards/Appearance';
import Contact from '@/components/cards/Contact';
import ThemeColors from '@/components/cards/ThemeColors';
import SEOSettings from '@/components/cards/SEOSettings';

// Sample initial state
const initialSettings = {
  banner: {
    mainBanner: 'https://placehold.co/1200x400/png',
    mobileBanner: 'https://placehold.co/600x800/png',
    showMainBanner: true,
  },
  theme: {
    primaryColor: '#7c3aed', // violet
    secondaryColor: '#f97316', // orange
    accentColor: '#f43f5e', // rose
    textColor: '#1e293b', // slate
    darkMode: {
      darkBackground: '#121212',
      darkText: '#ffffff'
    }
  },
  contact: {
    email: 'contact@livssentials.co',
    phone: '+1 234 567 8901',
    address: '123 E-commerce St, Digital City, DC 10101',
    socialMedia: {
      facebook: 'https://facebook.com/livssentials',
      instagram: 'https://instagram.com/livssentials',
      twitter: 'https://twitter.com/livssentials',
      linkedin: 'https://linkedin.com/company/livssentials'
    }
  },
  seo: {
    siteTitle: 'Livssentials - Quality Products for Your Lifestyle',
    metaDescription: 'Shop premium quality products for your lifestyle needs at Livssentials.',
    keywords: 'lifestyle, products, quality, ecommerce'
  }
};

const PlatformSettingsTab = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('appearance');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBannerChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      banner: {
        ...settings.banner,
        [key]: value
      }
    });
  };

  const handleThemeChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        [key]: value
      }
    });
  };

  const handleContactChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
        [key]: value
      }
    });
  };

  const handleSocialMediaChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
        socialMedia: {
          ...settings.contact.socialMedia,
          [key]: value
        }
      }
    });
  };

  const handleSeoChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      seo: {
        ...settings.seo,
        [key]: value
      }
    });
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Platform settings updated successfully');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Platform Settings</h1>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
          <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/10">
            <Image className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10">
            <Globe className="h-4 w-4 mr-2" />
            Contact Info
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-primary/10">
            <Palette className="h-4 w-4 mr-2" />
            Theme Colors
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-primary/10">
            <Globe className="h-4 w-4 mr-2" />
            SEO Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Appearance 
            banner={settings.banner} 
            onBannerChange={handleBannerChange} 
          />
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Contact 
            contact={settings.contact} 
            onContactChange={handleContactChange}
            onSocialMediaChange={handleSocialMediaChange}
          />
        </TabsContent>

        {/* Theme Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <ThemeColors 
            theme={settings.theme} 
            onThemeChange={handleThemeChange} 
          />
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo" className="space-y-6">
          <SEOSettings 
            seo={settings.seo} 
            onSeoChange={handleSeoChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformSettingsTab;