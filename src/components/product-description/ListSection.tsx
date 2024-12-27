import { ContentSection } from "./ContentSection";

interface ListSectionProps {
  title: string;
  items: string[];
}

export function ListSection({ title, items }: ListSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <ContentSection key={index} title={`Version ${index + 1}`} content={item} />
        ))}
      </div>
    </div>
  );
}