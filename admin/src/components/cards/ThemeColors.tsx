import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ThemeColorsProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    darkMode: {
      darkBackground: string;
      darkText: string;
    };
  };
  onThemeChange: (key: string, value: any) => void;
}

const ThemeColors = ({ theme, onThemeChange }: ThemeColorsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Colors</CardTitle>
        <CardDescription>
          Customize your website color scheme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-color" className="block mb-2">Primary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <Input 
                  id="primary-color" 
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => onThemeChange('primaryColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for buttons, links, and primary actions</p>
            </div>
            
            <div>
              <Label htmlFor="secondary-color" className="block mb-2">Secondary Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <Input 
                  id="secondary-color" 
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => onThemeChange('secondaryColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for secondary elements and accents</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="accent-color" className="block mb-2">Accent Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: theme.accentColor }}
                />
                <Input 
                  id="accent-color" 
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => onThemeChange('accentColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for highlights and special elements</p>
            </div>
            
            <div>
              <Label htmlFor="text-color" className="block mb-2">Text Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-md border dark:border-gray-600" 
                  style={{ backgroundColor: theme.textColor }}
                />
                <Input 
                  id="text-color" 
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => onThemeChange('textColor', e.target.value)}
                  className="w-full h-10 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Main text color for light mode</p>
            </div>
          </div>
        </div>

        {/* Preview section */}
        <div className="mt-8 border dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Theme Preview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Light mode preview */}
            <div className="p-4 bg-white border rounded-md shadow-sm">
              <h4 className="text-sm font-medium mb-3">Light Mode</h4>
              
              <div style={{ color: theme.textColor }}>
                <h5 className="font-bold" style={{ color: theme.textColor }}>Sample Heading</h5>
                <p className="text-sm mb-3">This is how your text will appear on light backgrounds.</p>
                
                <div className="flex gap-2 mb-3">
                  <Button className="text-white" style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}>
                    Primary
                  </Button>
                  <Button variant="outline" style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}>
                    Outline
                  </Button>
                </div>
                
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: theme.primaryColor }}></div>
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: theme.secondaryColor }}></div>
                <div className="h-2 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
              </div>
            </div>
            
            {/* Dark mode preview */}
            <div className="p-4 rounded-md shadow-sm" style={{ backgroundColor: theme.darkMode.darkBackground }}>
              <h4 className="text-sm font-medium mb-3" style={{ color: theme.darkMode.darkText }}>Dark Mode</h4>
              
              <div style={{ color: theme.darkMode.darkText }}>
                <h5 className="font-bold" style={{ color: theme.darkMode.darkText }}>Sample Heading</h5>
                <p className="text-sm mb-3">This is how your text will appear on dark backgrounds.</p>
                
                <div className="flex gap-2 mb-3">
                  <Button className="text-white" style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}>
                    Primary
                  </Button>
                  <Button variant="outline" style={{ color: theme.primaryColor, borderColor: theme.primaryColor, backgroundColor: 'transparent' }}>
                    Outline
                  </Button>
                </div>
                
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: theme.primaryColor }}></div>
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: theme.secondaryColor }}></div>
                <div className="h-2 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeColors;