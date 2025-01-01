import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="w-full h-12 text-lg font-semibold" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating Article...
        </>
      ) : (
        "Generate Article"
      )}
    </Button>
  );
}