import { cn } from "../../../utils";
import { formatQuestionTypeLabel } from "../../../utils/questionnaireTheme";

interface QuestionTypeBadgeProps {
  type?: string | null;
  className?: string;
}

export default function QuestionTypeBadge({
  type,
  className,
}: QuestionTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-grid h-6 place-items-center rounded-full bg-[var(--color-questionnaire-open-bg)] px-2 text-center text-[12px] font-semibold leading-none text-[var(--color-questionnaire-open)]",
        className
      )}
    >
      <span className="block leading-none">{formatQuestionTypeLabel(type)}</span>
    </span>
  );
}
