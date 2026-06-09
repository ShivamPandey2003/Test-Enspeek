import type { ReactNode } from "react";
import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";
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
  const badgeText =
    variant === "questionnaire"
      ? "AI-assisted questionnaire"
      : "Chat-first research design";

  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-brand-primary)_14%,var(--color-border-default)_86%)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-brand-info)_10%,var(--color-surface-softest)_90%)_0%,color-mix(in_srgb,var(--color-brand-primary)_9%,var(--color-surface-soft)_91%)_48%,color-mix(in_srgb,var(--color-text-supporting)_12%,var(--color-surface-softest)_88%)_100%)] px-5 py-5 text-center shadow-md md:px-6 md:py-6",
        className
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 text-sm font-semibold text-[var(--color-text-strong)] shadow-sm">
          <LuBotMessageSquare className="h-4 w-4 text-[var(--color-brand-primary)]" />
          {greeting}
        </div>
        <div className="inline-flex min-h-8 items-center gap-2 rounded-full bg-white/75 px-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-brand-primary)] shadow-sm">
          <LuSparkles className="h-4 w-4" />
          {badgeText}
        </div>
      </div>

      <div className="mx-auto mt-7 flex w-full max-w-3xl flex-col items-center">
        <h2
          className={cn(
            "mt-5 max-w-[640px] text-[clamp(1.7rem,2.75vw,2.75rem)] font-extrabold leading-[1.08] text-[var(--color-text-strong)]",
            titleClassName
          )}
        >
          {title}
        </h2>
        <p className="mt-4 max-w-[640px] text-[14px] leading-6 text-[var(--color-text-default)] md:text-[15px]">
          {description}
        </p>

        {actions ? <div className="mt-5 flex justify-center">{actions}</div> : null}
      </div>
    </section>
  );
}
