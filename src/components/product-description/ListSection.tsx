import { ContentSection } from "./ContentSection";

interface ListSectionProps {
  items: string[];
}

export function ListSection({ items }: ListSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ContentSection 
          key={index}
          content={item}
        />
      ))}
    </div>
  );
}