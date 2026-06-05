import type { ReactNode } from "react";
import { LuBotMessageSquare } from "react-icons/lu";
import { cn } from "../../utils";

interface PlatformHeroProps {
  actions?: ReactNode;
  className?: string;
  description: ReactNode;
  greeting: string;
  title: ReactNode;
  titleClassName?: string;
  variant?: "home" | "questionnaire";
}

export default function PlatformHero({
  actions,
  className,
  description,
  greeting,
  title,
  titleClassName,
  variant = "home",
}: PlatformHeroProps) {
  const isHome = variant === "home";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--color-core-accent)] bg-[color-mix(in_srgb,var(--color-core-accent)_10%,white_90%)] px-5 py-8 text-center shadow-md md:px-6 md:py-10",
        !isHome && "py-7 md:py-9",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-core-accent)]">
        <LuBotMessageSquare className="h-4 w-4" />
        {greeting}
      </div>

      <div className="mx-auto max-w-full">
        <h2
          className={cn(
            "font-semibold leading-[1.04] tracking-[-0.035em] text-[var(--color-core-accent)] lg:whitespace-nowrap",
            isHome
              ? "text-[clamp(1.9rem,3.2vw,3.25rem)]"
              : "text-[clamp(1.65rem,2.5vw,2.25rem)]",
            titleClassName
          )}
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-full text-[14px] leading-5.5 text-[var(--color-core-accent)] md:text-[15px] md:leading-6 xl:whitespace-nowrap">
          {description}
        </p>
      </div>

      {actions ? <div className="flex justify-center">{actions}</div> : null}
    </div>
  );
}
