import type { HTMLAttributes } from "react";

type skeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...props }: skeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`skeleton-shimmer ${className}`}
    />
  );
}
