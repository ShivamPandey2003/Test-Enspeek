import { cn } from "../../../../utils";

const LoadingConversation = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center px-6 text-center",
      compact ? "py-2" : "h-full min-h-[320px]"
    )}
  >
    <p className={cn("home-highlight font-semibold", compact ? "text-sm" : "text-base")}>
      Loading
      <span className="inline-flex w-5 justify-start text-left">
        <span className="animate-pulse">...</span>
      </span>
    </p>
  </div>
);

export default LoadingConversation;
