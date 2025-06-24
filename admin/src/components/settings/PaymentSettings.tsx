import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface PaymentSettingsProps {
  settings: {
    enableMobileMoney: boolean;
    enableCreditCard: boolean;
    mobileMoneyProviders: string[];
    paymentInstructions: string;
  };
  onChange: (key: string, value: any) => void;
}

const PaymentSettings = ({ settings, onChange }: PaymentSettingsProps) => {
  const [newProvider, setNewProvider] = useState('');

  const handleAddProvider = () => {
    if (!newProvider.trim()) return;
    
    const updatedProviders = [...(settings.mobileMoneyProviders || []), newProvider.trim()];
    onChange('mobileMoneyProviders', updatedProviders);
    setNewProvider('');
  };

  const handleRemoveProvider = (index: number) => {
    const updatedProviders = [...(settings.mobileMoneyProviders || [])];
    updatedProviders.splice(index, 1);
    onChange('mobileMoneyProviders', updatedProviders);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProvider();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableMobileMoney"
            checked={settings.enableMobileMoney || false}
            onCheckedChange={(checked) => onChange('enableMobileMoney', checked)}
          />
          <Label htmlFor="enableMobileMoney">Enable Mobile Money Payments</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableCreditCard"
            checked={settings.enableCreditCard || false}
            onCheckedChange={(checked) => onChange('enableCreditCard', checked)}
          />
          <Label htmlFor="enableCreditCard">Enable Credit Card Payments</Label>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Mobile Money Providers</h3>
        <p className="text-sm text-muted-foreground">
          Add the mobile money providers you accept payments from
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="mobileMoneyProviders">Add Provider</Label>
          <div className="flex gap-2">
            <Input
              id="mobileMoneyProviders"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              placeholder="e.g., MTN Mobile Money"
              onKeyDown={handleKeyPress}
            />
            <Button type="button" onClick={handleAddProvider}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Press Enter to add a provider
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(settings.mobileMoneyProviders || []).map((provider, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {provider}
                <button 
                  type="button" 
                  onClick={() => handleRemoveProvider(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(settings.mobileMoneyProviders || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No providers added</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Payment Instructions</h3>
        
        <div className="space-y-2">
          <Label htmlFor="paymentInstructions">Instructions for Customers</Label>
          <Textarea
            id="paymentInstructions"
            value={settings.paymentInstructions || ''}
            onChange={(e) => onChange('paymentInstructions', e.target.value)}
            placeholder="e.g., Please complete your payment within 24 hours. For mobile money payments, use the number provided in the confirmation email."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            These instructions will be shown to customers during checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;