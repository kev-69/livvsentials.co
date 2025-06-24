// import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { X, Plus, AlertTriangle } from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    enableOrderNotifications: boolean;
    enableStockAlerts: boolean;
    stockThreshold: number;
    // adminEmails: string[];
  };
  onChange: (key: string, value: any) => void;
}

const NotificationSettings = ({ settings, onChange }: NotificationSettingsProps) => {
  // const [newEmail, setNewEmail] = useState('');
  // const [emailError, setEmailError] = useState('');

  // const validateEmail = (email: string) => {
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return re.test(email);
  // };

  // const handleAddEmail = () => {
  //   if (!newEmail.trim()) {
  //     setEmailError('Email cannot be empty');
  //     return;
  //   }
    
  //   if (!validateEmail(newEmail)) {
  //     setEmailError('Invalid email format');
  //     return;
  //   }
    
  //   const updatedEmails = [...(settings.adminEmails || []), newEmail.trim()];
  //   onChange('adminEmails', updatedEmails);
  //   setNewEmail('');
  //   setEmailError('');
  // };

  // const handleRemoveEmail = (index: number) => {
  //   const updatedEmails = [...(settings.adminEmails || [])];
  //   updatedEmails.splice(index, 1);
  //   onChange('adminEmails', updatedEmails);
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     handleAddEmail();
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Order Notifications</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableOrderNotifications"
            checked={settings.enableOrderNotifications || false}
            onCheckedChange={(checked) => onChange('enableOrderNotifications', checked)}
          />
          <Label htmlFor="enableOrderNotifications">
            Enable Weekly Email Notifications for New Orders
          </Label>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Inventory Alerts</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableStockAlerts"
            checked={settings.enableStockAlerts || false}
            onCheckedChange={(checked) => onChange('enableStockAlerts', checked)}
          />
          <Label htmlFor="enableStockAlerts">
            Enable Low Stock Alerts
          </Label>
        </div>
        
        {settings.enableStockAlerts && (
          <div className="space-y-2">
            <Label htmlFor="stockThreshold">Low Stock Threshold</Label>
            <Input
              id="stockThreshold"
              type="number"
              min="1"
              value={settings.stockThreshold || 5}
              onChange={(e) => onChange('stockThreshold', parseInt(e.target.value, 10) || 5)}
              placeholder="5"
            />
            <p className="text-sm text-muted-foreground">
              You'll receive alerts when product stock falls below this threshold
            </p>
          </div>
        )}
      </div>

      {/* <Separator /> */}

      {/* <div className="grid gap-4">
        <h3 className="text-lg font-medium">Notification Recipients</h3>
        <p className="text-sm text-muted-foreground">
          Add email addresses that should receive admin notifications
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="adminEmails">Add Email</Label>
          <div className="flex gap-2">
            <Input
              id="adminEmails"
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="admin@yourstore.com"
              onKeyDown={handleKeyPress}
              className={emailError ? 'border-red-500' : ''}
            />
            <Button 
              type="button" 
              onClick={handleAddEmail}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {emailError && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {emailError}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(settings.adminEmails || []).map((email, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {email}
                <button 
                  type="button" 
                  onClick={() => handleRemoveEmail(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(settings.adminEmails || []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No notification recipients added
              </p>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default NotificationSettings;