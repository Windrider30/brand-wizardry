import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function BrandLogo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <BookOpen className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold">Brand Forge Foundry</span>
    </Link>
  );
}