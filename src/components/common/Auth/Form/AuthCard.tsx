import React from "react";
import { ColoredLogo } from "../../../../assets/icons";
import { cn } from "../../../../utils";

type AuthCardProps = { title: React.ReactNode; subtitle?: React.ReactNode; topSlot?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; compact?: boolean; titleClassName?: string; };

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, topSlot, children, footer, compact = false, titleClassName }) => {
  return (
    <div
      className={cn(
        "platform-auth-card w-full max-w-[34rem] rounded-[20px] border sm:rounded-[24px]",
        compact ? "px-4 py-5 min-[380px]:px-5 sm:px-6 sm:py-6" : "px-4 py-6 min-[380px]:px-5 sm:px-7 sm:py-9"
      )}
    >
      <div className={cn("flex flex-col items-center text-center", compact ? "mb-4 sm:mb-5" : "mb-6 sm:mb-7")}>
        <div className={cn("inline-flex max-w-full items-center justify-center gap-2", compact ? "mb-3" : "mb-5")}>
          <img src={ColoredLogo} alt="Enspeek" data-test-id="auth-brand-logo" className={cn("w-auto shrink-0", compact ? "h-8 sm:h-10" : "h-9 sm:h-11")} />
          <span data-test-id="auth-brand-name" className="min-w-0 text-[clamp(1.65rem,9vw,2rem)] font-bold leading-none text-login-primary">
            Enspeek
          </span>
        </div>
        {topSlot}
        <h2 data-test-id="auth-card-title" className={cn("max-w-full text-wrap break-words font-semibold leading-tight theme-text-strong", compact ? "text-[clamp(1.45rem,8vw,1.75rem)]" : "text-[clamp(1.5rem,8vw,2rem)]", titleClassName)}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 max-w-full text-wrap break-words text-sm text-login-muted">{subtitle}</p>
        ) : null}
      </div>

      {children}

      {footer ? <div className={cn("text-center", compact ? "mt-4" : "mt-6")}>{footer}</div> : null}
    </div>
  );
};

export default AuthCard;
