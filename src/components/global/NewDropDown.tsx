import React, { useState, useRef, useEffect } from "react";
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
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right" | "top" | "bottom";
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const NewDropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = "bottom-left",
  className = "",
  searchable = false,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [resolvedPosition, setResolvedPosition] = useState(position);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

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
      let nextPosition = position;
      let top = 0;
      let left = 0;

      if (
        position.startsWith("bottom") &&
        window.innerHeight - triggerRect.bottom < menuRect.height + 16 &&
        triggerRect.top > menuRect.height + 16
      ) {
        nextPosition = position.replace("bottom", "top") as typeof position;
      }

      if (
        position.startsWith("top") &&
        triggerRect.top < menuRect.height + 16 &&
        window.innerHeight - triggerRect.bottom > menuRect.height + 16
      ) {
        nextPosition = position.replace("top", "bottom") as typeof position;
      }

      switch (nextPosition) {
        case "top-left":
          top = triggerRect.top - menuRect.height - 8;
          left = triggerRect.left;
          break;
        case "top-right":
          top = triggerRect.top - menuRect.height - 8;
          left = triggerRect.right - menuRect.width;
          break;
        case "bottom-right":
        case "right":
          top = triggerRect.bottom + 8;
          left = triggerRect.right - menuRect.width;
          break;
        case "left":
        case "bottom-left":
          top = triggerRect.bottom + 8;
          left = triggerRect.left;
          break;
        case "top":
          top = triggerRect.top - menuRect.height - 8;
          left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
          break;
        case "bottom":
        default:
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
          break;
      }

      if (left < 12) left = 12;
      if (left + menuRect.width > window.innerWidth - 12) {
        left = window.innerWidth - menuRect.width - 12;
      }
      if (top < 12) top = 12;
      if (top + menuRect.height > window.innerHeight - 12) {
        top = Math.max(12, window.innerHeight - menuRect.height - 12);
      }

      setResolvedPosition(nextPosition);
      setMenuStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
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
  }, [isOpen, position, items.length, searchTerm]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionClasses = () => {
    const baseClasses =
      "home-dropdown max-h-[25rem] w-72 overflow-y-auto rounded-[22px] border shadow-xl transition-all duration-200 ease-out";
    
    switch (resolvedPosition) {
      default:
        return baseClasses;
    }
  };

  const menu = (
    <>
      <div ref={menuRef} className={getPositionClasses()} style={menuStyle}>
        {searchable && (
          <div className="home-surface sticky top-0 z-10 px-3 pb-2 pt-3">
            <div className="home-dropdown-search flex h-11 items-center gap-2 rounded-2xl border px-3">
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
        <div className="p-2.5" role="menu" aria-orientation="vertical">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                data-test-id={item.label}
                disabled={item.disabled}
                className={`home-dropdown-item flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition-colors duration-150 ${
                  item.disabled
                    ? "cursor-not-allowed text-gray-400"
                    : "cursor-pointer"
                }`}
                role="menuitem"
              >
                {item.icon && (
                  <span className="home-dropdown-icon-wrap mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    {item.icon}
                  </span>
                )}
                <span className="flex min-w-0 flex-col pt-0.5">
                  <span className="text-[15px] font-medium leading-tight">{item.label}</span>
                  {item.description && (
                    <span className="home-muted mt-1 text-xs">{item.description}</span>
                  )}
                </span>
              </button>
            ))
          ) : (
            <div className="home-muted px-3 py-4 text-sm">No results found</div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && createPortal(menu, document.body)}
    </div>
  );
};

export default NewDropdown;
