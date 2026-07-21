import React, { createContext, useState, useContext, forwardRef } from 'react';
import { type AccordionContextType } from './types';

export const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (context === undefined) {
    throw new Error('useAccordionContext must be used within an AccordionProvider');
  }
  return context;
};

export interface AccordionProps {
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((
  {
    children,
    type = 'single',
    defaultValue,
    collapsible = true,
    className = '',
  },
  ref
) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    if (type === 'single') {
      return defaultValue ? [defaultValue as string] : [];
    } else {
      return (defaultValue as string[]) || [];
    }
  });

  const toggleItem = (value: string) => {
    if (type === 'single') {
      if (expandedItems.includes(value) && collapsible) {
        setExpandedItems([]);
      } else {
        setExpandedItems([value]);
      }
    } else {
      if (expandedItems.includes(value)) {
        setExpandedItems(expandedItems.filter(item => item !== value));
      } else {
        setExpandedItems([...expandedItems, value]);
      }
    }
  };

  const isExpanded = (value: string) => expandedItems.includes(value);

  return (
    <AccordionContext.Provider value={{ toggleItem, isExpanded }}>
      <div ref={ref} className={`w-full ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export default Accordion;