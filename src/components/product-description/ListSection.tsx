import { ContentSection } from "./ContentSection";

interface ListSectionProps {
  items: string[];
}

export function ListSection({ items }: ListSectionProps) {
  // Add debug logging
  console.log("ListSection received items:", items);

  if (!items || items.length === 0) {
    console.log("No items provided to ListSection");
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