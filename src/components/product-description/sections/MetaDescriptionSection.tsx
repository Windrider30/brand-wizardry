import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "../ContentSection";

interface MetaDescriptionSectionProps {
  description: string;
}

export function MetaDescriptionSection({ description }: MetaDescriptionSectionProps) {
  if (!description) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meta Description</CardTitle>
      </CardHeader>
      <CardContent>
        <ContentSection content={description} />
      </CardContent>
    </Card>
  );
}