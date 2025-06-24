import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CiFacebook, CiInstagram } from "react-icons/ci";
import { FaSnapchat } from "react-icons/fa6";
import { BsTiktok } from "react-icons/bs";

interface ContactSettingsProps {
  settings: {
    email: string;
    phone: string;
    address: string;
    googleMapsLink: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      tiktok: string;
      snapchat: string;
    }
  };
  onChange: (key: string, value: any) => void;
  onSocialMediaChange: (key: string, value: string) => void;
}

const ContactSettings = ({ 
  settings, 
  onChange, 
  onSocialMediaChange 
}: ContactSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Business Contact Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={settings.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="contact@yourstore.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={settings.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+1 (234) 567-8901"
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Business Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={settings.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="123 Shop Street, City, Country"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="googleMapsLink">Google Maps Link</Label>
          <Input
            id="googleMapsLink"
            value={settings.googleMapsLink || ''}
            onChange={(e) => onChange('googleMapsLink', e.target.value)}
            placeholder="https://maps.google.com/?q=your-address"
          />
          <p className="text-sm text-muted-foreground">
            Add a Google Maps link to help customers find your physical location
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Social Media Links</h3>
        
        <div className="space-y-2">
          <Label htmlFor="facebook" className="flex items-center">
            <CiFacebook className="h-4 w-4 mr-2" />
            Facebook
          </Label>
          <Input
            id="facebook"
            value={settings.socialMedia?.facebook || ''}
            onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourstorepage"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instagram" className="flex items-center">
            <CiInstagram className="h-4 w-4 mr-2" />
            Instagram
          </Label>
          <Input
            id="instagram"
            value={settings.socialMedia?.instagram || ''}
            onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourstore"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tiktok" className="flex items-center">
            <BsTiktok className="h-4 w-4 mr-2" />
            Tiktok
          </Label>
          <Input
            id="tiktok"
            value={settings.socialMedia?.tiktok || ''}
            onChange={(e) => onSocialMediaChange('tiktok', e.target.value)}
            placeholder="https://tiktok.com/yourstore"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="snapchat" className="flex items-center">
            <FaSnapchat className="h-4 w-4 mr-2" />
            SnapChat
          </Label>
          <Input
            id="snapchat"
            value={settings.socialMedia?.snapchat || ''}
            onChange={(e) => onSocialMediaChange('snapchat', e.target.value)}
            placeholder="https://snapchat.com/c/yourstore"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSettings;