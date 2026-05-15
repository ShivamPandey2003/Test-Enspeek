import { cn } from "../../utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("theme-skeleton animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
