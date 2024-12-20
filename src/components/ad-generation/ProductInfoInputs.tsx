import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProductInfoInputsProps {
  productUrl: string;
  productTitle: string;
  productDescription: string;
  onProductUrlChange: (value: string) => void;
  onProductTitleChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
}

export function ProductInfoInputs({
  productUrl,
  productTitle,
  productDescription,
  onProductUrlChange,
  onProductTitleChange,
  onProductDescriptionChange,
}: ProductInfoInputsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productUrl">Product URL (Optional)</Label>
        <Input
          id="productUrl"
          placeholder="Enter the product URL"
          value={productUrl}
          onChange={(e) => onProductUrlChange(e.target.value)}
        />
      </div>

      <div className="text-center text-sm text-gray-500">OR</div>

      <div className="space-y-2">
        <Label htmlFor="productTitle">Product Title</Label>
        <Input
          id="productTitle"
          placeholder="Enter the product title"
          value={productTitle}
          onChange={(e) => onProductTitleChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productDescription">Product Description</Label>
        <Textarea
          id="productDescription"
          placeholder="Enter the product description"
          value={productDescription}
          onChange={(e) => onProductDescriptionChange(e.target.value)}
        />
      </div>
    </div>
  );
}