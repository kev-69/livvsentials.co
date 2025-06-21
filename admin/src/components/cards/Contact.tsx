import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface ContactProps {
  contact: {
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
      linkedin: string;
    };
  };
  onContactChange: (key: string, value: any) => void;
  onSocialMediaChange: (key: string, value: string) => void;
}

const Contact = ({ contact, onContactChange, onSocialMediaChange }: ContactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Update your business contact details displayed on your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input 
              id="contact-email" 
              value={contact.email}
              onChange={(e) => onContactChange('email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input 
              id="contact-phone" 
              value={contact.phone}
              onChange={(e) => onContactChange('phone', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact-address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Business Address
          </Label>
          <Textarea 
            id="contact-address" 
            value={contact.address}
            onChange={(e) => onContactChange('address', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Social Media Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="social-facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input 
                id="social-facebook" 
                value={contact.socialMedia.facebook}
                onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social-instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input 
                id="social-instagram" 
                value={contact.socialMedia.instagram}
                onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social-twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              <Input 
                id="social-twitter" 
                value={contact.socialMedia.twitter}
                onChange={(e) => onSocialMediaChange('twitter', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social-linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input 
                id="social-linkedin" 
                value={contact.socialMedia.linkedin}
                onChange={(e) => onSocialMediaChange('linkedin', e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;