import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Save,
  Globe,
  Image,
  // Palette,
  Mail,
  // Truck,
  Bell,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { getPlatformSettings, updatePlatformSetting } from '@/lib/api';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import ContactSettings from '@/components/settings/ContactSettings';
import SEOSettings from '@/components/settings/SEOSettings';
import EmailSettings from '@/components/settings/EmailSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import GallerySettings from '@/components/settings/GallerySettings';

// Object to match backend
const SettingKey = {
  APPEARANCE: "appearance",
  SEO: "seo",
  CONTACT_INFO: "contact_info",
  SHIPPING: "shipping",
  PAYMENT: "payment",
  EMAILS: "emails",
  NOTIFICATIONS: "notifications",
  GALLERY: "gallery"
} as const;

type SettingKey = typeof SettingKey[keyof typeof SettingKey];

const PlatformSettingsTab = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<SettingKey>(SettingKey.APPEARANCE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Fetch settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  // Check for changes
  useEffect(() => {
    // Only check after settings are loaded
    if (Object.keys(originalSettings).length === 0) return;
    
    // Compare current settings with original settings
    const currentSettingsJSON = JSON.stringify(settings);
    const originalSettingsJSON = JSON.stringify(originalSettings);
    
    setHasChanges(currentSettingsJSON !== originalSettingsJSON);
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getPlatformSettings();
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data))); // Deep copy
    } catch (error) {
      console.error('Failed to fetch platform settings:', error);
      toast.error('Failed to load platform settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (section: SettingKey, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (section: SettingKey, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...prev[section][parentKey],
          [key]: value
        }
      }
    }));
  };

  const handleSaveSection = async (section: SettingKey) => {
    if (!settings[section]) return;

    setSavingSection(section);
    try {
      await updatePlatformSetting(section, settings[section]);
      
      // Update original settings for this section to reflect saved state
      setOriginalSettings(prev => ({
        ...prev,
        [section]: JSON.parse(JSON.stringify(settings[section])) // Deep copy
      }));
      
      toast.success(`${formatSectionName(section)} settings updated successfully`);
    } catch (error) {
      console.error(`Failed to update ${section} settings:`, error);
      toast.error(`Failed to update ${formatSectionName(section)} settings. Please try again.`);
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save each section one by one
      for (const section of Object.values(SettingKey)) {
        if (settings[section]) {
          await updatePlatformSetting(section, settings[section]);
        }
      }
      
      // Update original settings to reflect saved state
      setOriginalSettings(JSON.parse(JSON.stringify(settings))); // Deep copy
      
      toast.success('All platform settings updated successfully');
    } catch (error) {
      console.error('Failed to update platform settings:', error);
      toast.error('Failed to update some settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatSectionName = (section: string): string => {
    return section
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading platform settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Platform Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your store's appearance, payment methods, and other settings
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={fetchSettings} 
            disabled={isSaving || isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={handleSaveAll} 
            disabled={isSaving || !hasChanges}
            // className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as SettingKey)} 
        className="space-y-4"
      >
        <div className="bg-background sticky top-0 z-10 pb-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
            <TabsTrigger value={SettingKey.APPEARANCE} className="data-[state=active]:bg-primary/10">
              <Image className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value={SettingKey.GALLERY} className="data-[state=active]:bg-primary/10">
              <Image className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value={SettingKey.SEO} className="data-[state=active]:bg-primary/10">
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value={SettingKey.CONTACT_INFO} className="data-[state=active]:bg-primary/10">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value={SettingKey.EMAILS} className="data-[state=active]:bg-primary/10">
              <Mail className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value={SettingKey.NOTIFICATIONS} className="data-[state=active]:bg-primary/10">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Appearance Tab */}
        <TabsContent value={SettingKey.APPEARANCE}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize your store's look and feel</CardDescription>
              </div>
              <Button 
                onClick={() => handleSaveSection(SettingKey.APPEARANCE)} 
                disabled={savingSection === SettingKey.APPEARANCE}
              >
                {savingSection === SettingKey.APPEARANCE ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent>
              <AppearanceSettings 
                settings={settings[SettingKey.APPEARANCE] || {}} 
                onChange={(key, value) => handleSettingChange(SettingKey.APPEARANCE, key, value)} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery  Tab */}
        <TabsContent value={SettingKey.GALLERY}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gallery Settings</CardTitle>
                <CardDescription>
                  Manage your gallery images and display settings
                </CardDescription>
              </div>
              
              <Button
                onClick={() => handleSaveSection(SettingKey.GALLERY)}
                disabled={isSaving || savingSection === SettingKey.GALLERY}
              >
                {savingSection === SettingKey.GALLERY ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </CardHeader>
            
            <CardContent>
              <GallerySettings 
                settings={settings[SettingKey.GALLERY] || { images: [], tags: [] }}
                onChange={(key, value) => handleSettingChange(SettingKey.GALLERY, key, value)}
                onSave={() => handleSaveSection(SettingKey.GALLERY)}
                isSaving={savingSection === SettingKey.GALLERY}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value={SettingKey.SEO}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your store for search engines</CardDescription>
              </div>
              <Button 
                onClick={() => handleSaveSection(SettingKey.SEO)} 
                disabled={savingSection === SettingKey.SEO}
              >
                {savingSection === SettingKey.SEO ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent>
              <SEOSettings 
                settings={settings[SettingKey.SEO] || {}} 
                onChange={(key, value) => handleSettingChange(SettingKey.SEO, key, value)} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value={SettingKey.CONTACT_INFO}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Set your store's contact details and social media</CardDescription>
              </div>
              <Button 
                onClick={() => handleSaveSection(SettingKey.CONTACT_INFO)} 
                disabled={savingSection === SettingKey.CONTACT_INFO}
              >
                {savingSection === SettingKey.CONTACT_INFO ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent>
              <ContactSettings 
                settings={settings[SettingKey.CONTACT_INFO] || {}} 
                onChange={(key, value) => handleSettingChange(SettingKey.CONTACT_INFO, key, value)}
                onSocialMediaChange={(key, value) => 
                  handleNestedSettingChange(SettingKey.CONTACT_INFO, 'socialMedia', key, value)
                } 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emails Tab */}
        <TabsContent value={SettingKey.EMAILS}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notifications and templates</CardDescription>
              </div>
              <Button 
                onClick={() => handleSaveSection(SettingKey.EMAILS)} 
                disabled={savingSection === SettingKey.EMAILS}
              >
                {savingSection === SettingKey.EMAILS ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent>
              <EmailSettings 
                settings={settings[SettingKey.EMAILS] || {}} 
                onChange={(key, value) => handleSettingChange(SettingKey.EMAILS, key, value)}
                onTemplateChange={(template, field, value) => {
                  setSettings(prev => ({
                    ...prev,
                    [SettingKey.EMAILS]: {
                      ...prev[SettingKey.EMAILS],
                      templates: {
                        ...prev[SettingKey.EMAILS].templates,
                        [template]: {
                          ...prev[SettingKey.EMAILS].templates[template],
                          [field]: value
                        }
                      }
                    }
                  }));
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value={SettingKey.NOTIFICATIONS}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure admin notifications and alerts</CardDescription>
              </div>
              <Button 
                onClick={() => handleSaveSection(SettingKey.NOTIFICATIONS)} 
                disabled={savingSection === SettingKey.NOTIFICATIONS}
              >
                {savingSection === SettingKey.NOTIFICATIONS ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardHeader>
            <CardContent>
              <NotificationSettings 
                settings={settings[SettingKey.NOTIFICATIONS] || {}} 
                onChange={(key, value) => handleSettingChange(SettingKey.NOTIFICATIONS, key, value)} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformSettingsTab;