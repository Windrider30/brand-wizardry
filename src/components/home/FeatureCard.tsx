import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
}

export const FeatureCard = ({ icon: Icon, title, description, route }: FeatureCardProps) => {
  return (
    <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Icon className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">{title}</h2>
      <p className="text-base md:text-lg text-black mb-4">{description}</p>
      <Link to={route} className="block">
        <Button variant="outline" className="w-full text-base md:text-lg border-black">
          Get Started
        </Button>
      </Link>
    </div>
  );
};