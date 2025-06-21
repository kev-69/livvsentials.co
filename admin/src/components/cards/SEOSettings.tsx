import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SEOSettingsProps {
  seo: {
    siteTitle: string;
    metaDescription: string;
    keywords: string;
  };
  onSeoChange: (key: string, value: string) => void;
}

const SEOSettings = ({ seo, onSeoChange }: SEOSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>
          Optimize your website for search engines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="site-title">Site Title</Label>
          <Input 
            id="site-title" 
            value={seo.siteTitle}
            onChange={(e) => onSeoChange('siteTitle', e.target.value)}
          />
          <p className="text-xs text-gray-500">The title that appears in search engine results</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea 
            id="meta-description" 
            value={seo.metaDescription}
            onChange={(e) => onSeoChange('metaDescription', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500">Brief description of your website that appears in search results (150-160 characters recommended)</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Textarea 
            id="keywords" 
            value={seo.keywords}
            onChange={(e) => onSeoChange('keywords', e.target.value)}
            rows={2}
          />
          <p className="text-xs text-gray-500">Comma-separated keywords related to your business</p>
        </div>

        {/* SEO Preview */}
        <div className="mt-4 p-4 border rounded-md dark:border-gray-700">
          <h3 className="text-sm font-medium mb-2">Search Engine Preview</h3>
          <div className="p-4 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
            <h4 className="text-xl text-blue-600 dark:text-blue-400 font-medium">{seo.siteTitle}</h4>
            <p className="text-green-600 dark:text-green-400 text-sm">https://livssentials.co</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{seo.metaDescription}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOSettings;