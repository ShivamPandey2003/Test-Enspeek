import React, { useId } from 'react';
import { useAccordionContext } from './Accordion';

export interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  disabled = false,
  className = '',
}) => {
  const { isExpanded } = useAccordionContext();
  const expanded = isExpanded(value);
  const id = useId();
  const headingId = `${id}-heading`;
  const contentId = `${id}-content`;

  return (
    <div 
      className={`border-b border-gray-200 last:border-b-0 ${className}`}
      data-state={expanded ? 'open' : 'closed'}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const childType = child.type;

          if (childType === AccordionTrigger) {
            return React.cloneElement(child, {
              value,
              disabled,
              expanded,
              headingId,
              contentId,
            } as any);
          }

          if (childType === AccordionContent) {
            return React.cloneElement(child, {
              expanded,
              headingId,
              contentId,
            } as any);
          }

          return child;
        }
        return child;
      })}
    </div>
  );
};

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  expanded?: boolean;
  headingId?: string;
  contentId?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className = '',
  value = '',
  disabled = false,
  expanded = false,
  headingId = '',
  contentId = '',
}) => {
  const { toggleItem } = useAccordionContext();

  const isNestedAction = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        '[data-accordion-action="true"], button, a, input, select, textarea, [role="button"]'
      )
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isNestedAction(e.target) && e.target !== e.currentTarget) {
      return;
    }
    if (!disabled && value) {
      toggleItem(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isNestedAction(e.target) && e.target !== e.currentTarget) {
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && value) {
        toggleItem(value);
      }
    }
  };

  return (
    <h3 id={headingId}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={expanded}
        aria-controls={contentId}
        id={headingId}
        className={`flex w-full items-center justify-between text-base font-medium text-left transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-blue-600'
        } ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-state={expanded ? 'open' : 'closed'}
      >
        {children}
      </div>
    </h3>
  );
};

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
  contentId?: string;
  headingId?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  expanded = false,
  contentId = '',
  headingId = '',
}) => {
  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={headingId}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        expanded ? 'max-h-fit' : 'max-h-0'
      } ${className}`}
      hidden={!expanded}
      data-state={expanded ? 'open' : 'closed'}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
};

export default AccordionItem;
