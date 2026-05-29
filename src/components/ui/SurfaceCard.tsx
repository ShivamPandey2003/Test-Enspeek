import * as React from "react";
import { cn } from "../../utils";

type SurfaceCardVariant = "default" | "toolbar" | "soft";

const variantClassMap: Record<SurfaceCardVariant, string> = {
  default: "report-card",
  toolbar: "report-toolbar-card",
  soft: "crosstab-soft-panel",
};

type SurfaceCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceCardVariant;
};

export const SurfaceCard = React.forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(variantClassMap[variant], className)}
      {...props}
    />
  )
);

SurfaceCard.displayName = "SurfaceCard";

export const SurfaceCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("report-card-header flex items-center justify-between px-5 py-4", className)}
    {...props}
  />
));

SurfaceCardHeader.displayName = "SurfaceCardHeader";

export const SurfaceCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("report-title text-[16px] font-semibold", className)}
    {...props}
  />
));

SurfaceCardTitle.displayName = "SurfaceCardTitle";

export const SurfaceCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));

SurfaceCardContent.displayName = "SurfaceCardContent";
