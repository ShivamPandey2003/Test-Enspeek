import React from "react";
import { ColoredLogo } from "../../../../assets/icons";
import { cn } from "../../../../utils";

type AuthCardProps = { title: React.ReactNode; subtitle?: React.ReactNode; topSlot?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; compact?: boolean; };

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, topSlot, children, footer, compact = false }) => {
  return (
    <div
      className={cn(
        "platform-auth-card w-full max-w-[34rem] rounded-[24px] border backdrop-blur-sm",
        compact ? "px-5 py-5 sm:px-6 sm:py-6" : "px-5 py-7 sm:px-7 sm:py-9"
      )}
    >
      <div className={cn("flex flex-col items-center text-center", compact ? "mb-4 sm:mb-5" : "mb-6 sm:mb-7")}>
        <div className={cn("inline-flex w-fit items-center justify-center gap-[5px]", compact ? "mb-3" : "mb-5")}>
          <img src={ColoredLogo} alt="Enspeek" className={cn("w-auto", compact ? "h-9 sm:h-10" : "h-10 sm:h-11")} />
          <span className="text-[2rem] font-bold leading-none text-login-primary">
            Enspeek
          </span>
        </div>
        {topSlot}
        <h2 className={cn("font-semibold leading-tight theme-text-strong", compact ? "text-[1.75rem]" : "text-[2rem]")}>
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
