import React from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  followCursor?: boolean;
  children: React.ReactElement;
}

export const getTooltipAttributes = (
  content?: string,
  _position?: TooltipPosition,
  _followCursor?: boolean
) => {
  if (!content) {
    return {};
  }

  return {
    title: content,
  } as const;
};

export const TooltipLayer: React.FC = () => null;

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  className = "",
  children,
}) => {
  const child = React.Children.only(children) as React.ReactElement<any>;
  const mergedClassName = [child.props.className, className]
    .filter(Boolean)
    .join(" ");

  return React.cloneElement(child, {
    ...getTooltipAttributes(content),
    className: mergedClassName || undefined,
  });
};
