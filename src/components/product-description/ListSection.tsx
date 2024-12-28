import { ContentSection } from "./ContentSection";

interface ListSectionProps {
  title: string;
  items: string[];
}

export function ListSection({ title, items }: ListSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, index) => (
          <ContentSection 
            key={index} 
            title={`Version ${index + 1}`} 
            content={item} 
          />
        ))}
      </div>
    </div>
  );
}