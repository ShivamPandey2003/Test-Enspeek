import { useState, type ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "../../../utils";
import Button from "../../ui/Button";

export const SimpleAccordion = ({ children }: { children: ReactNode }) => {
  return <div className="w-full">{children}</div>;
};

export const SimpleAccordionItem = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState("");

  return (
    <div className="border border-gray-200 mb-2">
      <Button
        type="button"
        varinat="ghost"
        className="w-full justify-between rounded-none px-2 py-2 font-medium text-left text-[var(--color-text-strong)] shadow-none hover:bg-[var(--color-surface-soft)]"
        onClick={() => setExpanded((prev) => (prev === id ? "" : id))}
      >
        <span>{title || "Untitled"}</span>
        <IoIosArrowDown
          className={cn(
            "transition-transform duration-300",
            expanded === id ? "rotate-180" : ""
          )}
        />
      </Button>
      {expanded === id && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
