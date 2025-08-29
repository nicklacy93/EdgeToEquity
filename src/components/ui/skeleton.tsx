﻿import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md bg-muted motion-safe:animate-pulse motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
