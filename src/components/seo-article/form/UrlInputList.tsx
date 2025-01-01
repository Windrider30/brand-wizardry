import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface UrlInputListProps {
  type: 'product' | 'image';
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function UrlInputList({ type, urls, onChange }: UrlInputListProps) {
  const handleAddUrl = () => {
    onChange([...urls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    onChange(newUrls);
  };

  return (
    <div className="space-y-3">
      <Label className="text-lg font-semibold">
        {type === 'product' ? 'Product URLs' : 'Image URLs'}
      </Label>
      {urls.map((url, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder={`Enter ${type} URL`}
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            className="text-base h-12"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleRemoveUrl(index)}
            className="h-12 w-12"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base"
        onClick={handleAddUrl}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add {type === 'product' ? 'Product' : 'Image'} URL
      </Button>
    </div>
  );
}