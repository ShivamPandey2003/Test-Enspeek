import type { HTMLAttributes } from "react";
import { cn } from "../../utils";

type AvatarInitialsProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  initials: string;
  title?: string;
};

const AvatarInitials = ({
  label,
  initials,
  className,
  title,
  ...props
}: AvatarInitialsProps) => (
  <div
    {...props}
    aria-label={label}
    title={title ?? label}
    className={cn(
      "inline-flex shrink-0 select-none items-center justify-center rounded-full text-center font-semibold leading-none",
      className
    )}
  >
    <span className="block translate-y-px leading-none">
      {initials}
    </span>
  </div>
);

export default AvatarInitials;
