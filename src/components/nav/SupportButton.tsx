import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface SupportButtonProps {
  hasSubscription: boolean;
}

export function SupportButton({ hasSubscription }: SupportButtonProps) {
  if (!hasSubscription) return null;

  return (
    <a href="mailto:support@brandforgefoundry.com.au" className="ml-4">
      <Button variant="ghost" className="text-lg flex items-center gap-2">
        <Mail className="h-5 w-5" />
        Contact Support
      </Button>
    </a>
  );
}