"use client"

import type React from "react"

interface TypingIndicatorProps {
  className?: string
  showText?: boolean
  text?: string
  textColor?: string
  size?: "sm" | "md" | "lg"
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = "",
  showText = true,
  text = "Thinking",
  textColor = "text-dark",
  size = "md",
}) => {
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`mb-4 text-left ${className}`}>
      <div className="inline-block p-3">
        <div className="flex items-center">
          {showText && (
            <span className={`${textColor} ${textSizeClasses[size]} font-bold`}>
              {text}
            </span>
          )}
          <span
            className={`${textColor} copying-dots ml-0.5 inline-flex w-[1.5em] justify-start text-[1.75rem] leading-none`}
            aria-hidden="true"
          >
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
