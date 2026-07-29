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
  const isQuestionnaire = variant === "questionnaire";
  const badgeText =
    isQuestionnaire
      ? "AI-assisted questionnaire"
      : "Chat-first research design";

  return (
    <section
      className={cn(
        "platform-card-shadow-strong mx-auto w-full max-w-6xl overflow-hidden border",
        isQuestionnaire
          ? "questionnaire-card questionnaire-border rounded-[24px]"
          : "home-surface home-border-soft rounded-[30px]",
        className
      )}
    >
      <div
        className={cn(
          "platform-hero-surface",
          isQuestionnaire ? "px-5 py-4 md:px-6 md:py-5" : "px-5 py-5 md:px-6 md:py-6"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {isQuestionnaire ? (
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[16px] bg-gradient-to-br from-login-primary to-action shadow-lg">
                <LuBotMessageSquare className="h-5 w-5 text-white" />
                <LuSparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-400" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold questionnaire-heading shadow-sm">
                {greeting}
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold home-heading shadow-sm">
              <LuBotMessageSquare className="h-4 w-4 text-login-primary" />
              {greeting}
            </div>
          )}

          <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
            <LuSparkles className="h-3.5 w-3.5" />
            {badgeText}
          </span>
        </div>

        <div className={cn("mx-auto max-w-full text-center", isQuestionnaire ? "mt-6" : "mt-6")}>
          <h2
            className={cn(
              isQuestionnaire
                ? "questionnaire-heading mx-auto max-w-full text-[clamp(1.65rem,2.5vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] lg:whitespace-nowrap"
                : "home-title text-[clamp(1.9rem,3.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.05em] lg:whitespace-nowrap",
              titleClassName
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mx-auto mt-3 max-w-full text-center text-[14px] md:text-[15px]",
              isQuestionnaire
                ? "leading-5 text-[var(--color-text-strong)] xl:whitespace-nowrap"
                : "home-text leading-5.5 md:leading-6 xl:whitespace-nowrap"
            )}
          >
            {description}
          </p>
        </div>

        {actions ? <div className="mt-6 flex justify-center">{actions}</div> : null}
      </div>
    </section>
  );
}
