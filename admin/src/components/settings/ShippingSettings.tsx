import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

interface ShippingRegion {
  name: string;
  fee: number;
}

interface ShippingSettingsProps {
  settings: {
    enableFreeShipping: boolean;
    freeShippingThreshold: number;
    defaultShippingFee: number;
    shippingRegions: ShippingRegion[];
  };
  onChange: (key: string, value: any) => void;
}

const ShippingSettings = ({ settings, onChange }: ShippingSettingsProps) => {
  const [newRegion, setNewRegion] = useState<ShippingRegion>({ name: '', fee: 0 });

  const handleAddRegion = () => {
    if (!newRegion.name) return;
    
    const updatedRegions = [...(settings.shippingRegions || []), newRegion];
    onChange('shippingRegions', updatedRegions);
    setNewRegion({ name: '', fee: 0 });
  };

  const handleRemoveRegion = (index: number) => {
    const updatedRegions = [...(settings.shippingRegions || [])];
    updatedRegions.splice(index, 1);
    onChange('shippingRegions', updatedRegions);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-medium">General Shipping Settings</h3>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="enableFreeShipping"
            checked={settings.enableFreeShipping || false}
            onCheckedChange={(checked) => onChange('enableFreeShipping', checked)}
          />
          <Label htmlFor="enableFreeShipping">
            Enable Free Shipping for Orders Above Threshold
          </Label>
        </div>
        
        {settings.enableFreeShipping && (
          <div className="space-y-2">
            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (GHS)</Label>
            <Input
              id="freeShippingThreshold"
              type="number"
              min="0"
              value={settings.freeShippingThreshold || 0}
              onChange={(e) => onChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
              placeholder="100"
            />
            <p className="text-sm text-muted-foreground">
              Orders above this amount will qualify for free shipping
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="defaultShippingFee">Default Shipping Fee (GHS)</Label>
          <Input
            id="defaultShippingFee"
            type="number"
            min="0"
            value={settings.defaultShippingFee || 0}
            onChange={(e) => onChange('defaultShippingFee', parseFloat(e.target.value) || 0)}
            placeholder="10"
          />
          <p className="text-sm text-muted-foreground">
            This fee will be applied when no specific region matches the customer's address
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Shipping Regions</h3>
        <p className="text-sm text-muted-foreground">
          Define different shipping fees for specific regions or locations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regionName">Region Name</Label>
            <Input
              id="regionName"
              value={newRegion.name}
              onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
              placeholder="e.g., Accra, Central Region, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="regionFee">Shipping Fee (GHS)</Label>
            <div className="flex gap-2">
              <Input
                id="regionFee"
                type="number"
                min="0"
                value={newRegion.fee || ''}
                onChange={(e) => setNewRegion({ ...newRegion, fee: parseFloat(e.target.value) || 0 })}
                placeholder="15"
              />
              <Button 
                type="button" 
                onClick={handleAddRegion}
                disabled={!newRegion.name}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {(settings.shippingRegions || []).length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Fee (GHS)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(settings.shippingRegions || []).map((region, index) => (
                  <TableRow key={index}>
                    <TableCell>{region.name}</TableCell>
                    <TableCell className="text-right">{region.fee.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRegion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground border rounded-md">
            No shipping regions defined
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingSettings;