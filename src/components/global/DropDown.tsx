import React from "react";
import { cn } from "../../utils";
import Checkbox from "../ui/Checkbox";
interface DropdownData {
  Title: string;
  Icon?: React.ElementType;
  checked?: boolean;
  onClick?: () => void;
}
interface DropDownProps {
  className?: string;
  Data: DropdownData[];
  showCheckbox?: boolean;
}
const DropDown: React.FC<DropDownProps> = ({ className, Data, showCheckbox = false }) => {
  return (
    <div
      className={cn(
        "home-dropdown absolute right-0 z-50 mt-2 overflow-hidden rounded-2xl border p-1.5 shadow-xl",
        className
      )}
      role="menu"
    >
      <ul className="space-y-1 text-sm text-gray-700">
        {Data.map(({ Title, Icon, checked, onClick }, i) => (
          <li
            key={i}
            data-test-id={Title}
            className={cn(
              "home-dropdown-item flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors",
              Title === "Delete" && "text-rose-500 hover:bg-rose-50",
              (Title === "Add New Filters" || Title === "Share Study") &&
                "pointer-events-none opacity-35"
            )}
            onClick={onClick}
            tabIndex={0}
          >
            {showCheckbox && (
              <Checkbox
                data-test-id={`${Title}_BOX`}
                checked={checked}
                onChange={onClick}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {Icon && (
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary-softest)] text-login-primary">
                <Icon className="h-4 w-4 shrink-0" />
              </span>
            )}
            <span className="whitespace-nowrap">{Title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DropDown;
