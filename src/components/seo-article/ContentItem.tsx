import React from 'react';

interface ContentItemProps {
  type: 'image' | 'product-link' | 'markdown-link' | 'h1' | 'h2' | 'h3' | 'paragraph';
  content: string;
  url?: string;
  linkText?: string;
}

export function ContentItem({ type, content, url, linkText }: ContentItemProps) {
  switch (type) {
    case 'image':
      return (
        <img 
          src={content} 
          alt="Content" 
          className="w-full h-auto object-cover mb-4 max-h-[400px]" 
          loading="lazy" 
        />
      );
    
    case 'product-link':
      return (
        <a 
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline block mb-4"
        >
          {content}
        </a>
      );
    
    case 'markdown-link':
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline block mb-4"
        >
          {linkText}
        </a>
      );
    
    case 'h1':
      return <h1 className="text-3xl font-bold mb-4">{content}</h1>;
    
    case 'h2':
      return <h2 className="text-2xl font-bold mb-3">{content}</h2>;
    
    case 'h3':
      return <h3 className="text-xl font-bold mb-2">{content}</h3>;
    
    case 'paragraph':
      return <p className="mb-4">{content}</p>;
    
    default:
      return null;
  }
}