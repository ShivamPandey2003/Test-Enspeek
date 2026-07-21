import React, { useCallback, useState, useRef, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { createPortal } from "react-dom";
import Input from "../ui/Input";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}

interface DropdownProps {
  trigger?: React.ReactNode;
  renderTrigger?: (controls: {
    isOpen: boolean;
    toggle: () => void;
  }) => React.ReactNode;
  items?: DropdownItem[];
  renderContent?: (controls: { close: () => void }) => React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right" | "top" | "bottom";
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  contentAriaLabel?: string;
}

const NewDropdown: React.FC<DropdownProps> = ({
  trigger,
  renderTrigger,
  items = [],
  renderContent,
  position = "bottom-left",
  className = "",
  searchable = false,
  searchPlaceholder = "Search...",
  contentAriaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [resolvedPosition, setResolvedPosition] = useState(position);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const closeDropdown = useCallback((restoreFocus = false) => {
    setSearchTerm("");
    setIsOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => {
        dropdownRef.current
          ?.querySelector<HTMLElement>("button, [href], input, select")
          ?.focus();
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        closeDropdown(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown(true);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) {
      setResolvedPosition(position);
      setMenuStyle({});
      return;
    }

    const updatePosition = () => {
      if (!dropdownRef.current || !menuRef.current) return;

      const triggerRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportMargin = 12;
      const availableWidth = Math.max(0, window.innerWidth - viewportMargin * 2);
      const availableHeight = Math.max(0, window.innerHeight - viewportMargin * 2);
      const menuWidth = Math.min(menuRect.width, availableWidth);
      const menuHeight = Math.min(menuRect.height, availableHeight);
      let nextPosition = position;
      let top = 0;
      let left = 0;

      if (
        position.startsWith("bottom") &&
        window.innerHeight - triggerRect.bottom < menuHeight + 16 &&
        triggerRect.top > menuHeight + 16
      ) {
        nextPosition = position.replace("bottom", "top") as typeof position;
      }

      if (
        position.startsWith("top") &&
        triggerRect.top < menuHeight + 16 &&
        window.innerHeight - triggerRect.bottom > menuHeight + 16
      ) {
        nextPosition = position.replace("top", "bottom") as typeof position;
      }

      switch (nextPosition) {
        case "top-left":
          top = triggerRect.top - menuHeight - 8;
          left = triggerRect.left;
          break;
        case "top-right":
          top = triggerRect.top - menuHeight - 8;
          left = triggerRect.right - menuWidth;
          break;
        case "bottom-right":
        case "right":
          top = triggerRect.bottom + 8;
          left = triggerRect.right - menuWidth;
          break;
        case "left":
        case "bottom-left":
          top = triggerRect.bottom + 8;
          left = triggerRect.left;
          break;
        case "top":
          top = triggerRect.top - menuHeight - 8;
          left = triggerRect.left + (triggerRect.width - menuWidth) / 2;
          break;
        case "bottom":
        default:
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - menuWidth) / 2;
          break;
      }

      if (left < viewportMargin) left = viewportMargin;
      if (left + menuWidth > window.innerWidth - viewportMargin) {
        left = window.innerWidth - menuWidth - viewportMargin;
      }
      if (top < viewportMargin) top = viewportMargin;
      if (top + menuHeight > window.innerHeight - viewportMargin) {
        top = Math.max(
          viewportMargin,
          window.innerHeight - menuHeight - viewportMargin
        );
      }

      setResolvedPosition(nextPosition);
      setMenuStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${availableWidth}px`,
        maxHeight: `${availableHeight}px`,
        zIndex: 80,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, position]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    closeDropdown(true);
  };
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionClasses = () => {
    const baseClasses =
      "home-dropdown max-h-[25rem] w-64 overflow-y-auto rounded-[16px] border shadow-xl transition-all duration-200 ease-out";
    
    switch (resolvedPosition) {
      default:
        return baseClasses;
    }
  };

  const menu = (
    <>
      <div ref={menuRef} className={getPositionClasses()} style={menuStyle}>
        {searchable && (
          <div className="home-surface sticky top-0 z-10 px-2.5 pb-2 pt-2.5">
            <div className="home-dropdown-search flex h-9 items-center gap-2 rounded-xl border px-2.5">
              <HiOutlineSearch className="home-muted h-4 w-4" />
              <Input
                variant="bare"
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="home-dropdown-search h-full w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        )}
        <div
          className="p-1.5"
          role={renderContent && contentAriaLabel ? "dialog" : renderContent ? undefined : "menu"}
          aria-label={renderContent ? contentAriaLabel : undefined}
          aria-orientation={renderContent ? undefined : "vertical"}
        >
          {renderContent ? (
            renderContent({ close: () => closeDropdown(true) })
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                data-test-id={item.label}
                disabled={item.disabled}
                className={`home-dropdown-item flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                  item.disabled
                    ? "cursor-not-allowed text-gray-400"
                    : item.tone === "danger"
                      ? "cursor-pointer text-rose-600 hover:bg-rose-50"
                      : "cursor-pointer"
                }`}
                role="menuitem"
              >
                {item.icon && (
                  <span className="home-dropdown-icon-wrap flex h-6 w-6 shrink-0 items-center justify-center rounded-full [&>svg]:h-3.5 [&>svg]:w-3.5">
                    {item.icon}
                  </span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span className="text-[14px] font-medium leading-5">{item.label}</span>
                  {item.description && (
                    <span className="home-muted mt-0.5 text-xs leading-4">{item.description}</span>
                  )}
                </span>
              </button>
            ))
          ) : (
            <div className="home-muted px-3 py-3 text-sm">No results found</div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {renderTrigger ? (
        renderTrigger({
          isOpen,
          toggle: () => setIsOpen((current) => !current),
        })
      ) : (
        <div
          onClick={() => setIsOpen((current) => !current)}
          className="cursor-pointer"
        >
          {trigger}
        </div>
      )}

      {isOpen && createPortal(menu, document.body)}
    </div>
  );
};

export default NewDropdown;
