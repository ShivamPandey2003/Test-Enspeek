import React from "react";
import { ColoredLogo } from "../../../../assets/icons";
import { cn } from "../../../../utils";

type AuthCardProps = { title: React.ReactNode; subtitle?: React.ReactNode; topSlot?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; compact?: boolean; titleClassName?: string; };

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, topSlot, children, footer, compact = false, titleClassName }) => {
  return (
    <div
      className={cn(
        "platform-auth-card w-full max-w-[34rem] rounded-[24px] border",
        compact ? "px-5 py-5 sm:px-6 sm:py-6" : "px-5 py-7 sm:px-7 sm:py-9"
      )}
    >
      <div className={cn("flex flex-col items-center text-center", compact ? "mb-4 sm:mb-5" : "mb-6 sm:mb-7")}>
        <div className={cn("inline-flex w-fit items-center justify-center gap-2", compact ? "mb-3" : "mb-5")}>
          <img src={ColoredLogo} alt="Enspeek" data-test-id="auth-brand-logo" className={cn("w-auto", compact ? "h-9 sm:h-10" : "h-10 sm:h-11")} />
          <span data-test-id="auth-brand-name" className="text-[2rem] font-bold leading-none text-login-primary">
            Enspeek
          </span>
        </div>
        {topSlot}
        <h2 data-test-id="auth-card-title" className={cn("font-semibold leading-tight theme-text-strong", compact ? "text-[1.75rem]" : "text-[2rem]", titleClassName)}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-login-muted">{subtitle}</p>
        ) : null}
      </div>

      {children}

      {footer ? <div className={cn("text-center", compact ? "mt-4" : "mt-6")}>{footer}</div> : null}
    </div>
  );
};

export default AuthCard;
