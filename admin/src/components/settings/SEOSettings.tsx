import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';

interface SEOSettingsProps {
  settings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  onChange: (key: string, value: any) => void;
}

const SEOSettings = ({ settings, onChange }: SEOSettingsProps) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const updatedKeywords = [...(settings.keywords || []), newKeyword.trim()];
    onChange('keywords', updatedKeywords);
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    const updatedKeywords = [...(settings.keywords || [])];
    updatedKeywords.splice(index, 1);
    onChange('keywords', updatedKeywords);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={settings.metaTitle || ''}
            onChange={(e) => onChange('metaTitle', e.target.value)}
            placeholder="Your Store - High Quality Products"
          />
          <p className="text-sm text-muted-foreground">
            Character count: {(settings.metaTitle || '').length}/60
            {(settings.metaTitle || '').length > 60 && (
              <span className="text-red-500 ml-1">
                (Too long! Google typically displays the first 50-60 characters)
              </span>
            )}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={settings.metaDescription || ''}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            placeholder="Your store metaDescription for search engine results."
            className="min-h-[100px]"
          />
          <p className="text-sm text-muted-foreground">
            Character count: {(settings.metaDescription || '').length}/160
            {(settings.metaDescription || '').length > 160 && (
              <span className="text-red-500 ml-1">
                (Too long! Google typically displays around 155-160 characters)
              </span>
            )}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <h3 className="text-lg font-medium">Keywords</h3>
        
        <div className="space-y-2">
          <Label htmlFor="keywords">SEO Keywords</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword"
              onKeyDown={handleKeyPress}
            />
            <Button type="button" onClick={handleAddKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Press Enter to add a keyword
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(settings.keywords || []).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {keyword}
                <button 
                  type="button" 
                  onClick={() => handleRemoveKeyword(index)}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(settings.keywords || []).length === 0 && (
              <p className="text-sm text-muted-foreground">No keywords added</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* SEO Preview */}
        <div className="mt-4 p-4 border rounded-md dark:border-gray-700">
          <h3 className="text-sm font-medium mb-2">Search Engine Preview</h3>
          <div className="p-4 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
            <h4 className="text-xl text-blue-600 dark:text-blue-400 font-medium">{settings.metaTitle}</h4>
            <p className="text-green-600 dark:text-green-400 text-sm">https://livssentials.com</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{settings.metaDescription}</p>
          </div>
        </div>
    </div>
  );
};

export default SEOSettings;