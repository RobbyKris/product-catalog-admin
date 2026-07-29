import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[linear-gradient(90deg,#eee3d8_25%,#f7efe8_50%,#eee3d8_75%)] bg-[length:200%_100%] ${className}`}
    />
  );
}

type ProductTableSkeletonProps = {
  rows?: number;
};

const titleWidths = [
  "w-[220px]",
  "w-[260px]",
  "w-[190px]",
  "w-[240px]",
];

export function ProductTableSkeleton({
  rows = 4,
}: ProductTableSkeletonProps) {
  return (
    <section
      // aria-label="Loading products"
      // aria-live="polite"
      className="overflow-hidden rounded-card border border-border bg-surface shadow-soft"
      role="status"
    >
      <span className="sr-only">Loading products...</span>

      {Array.from({ length: rows }).map((_, index) => (
        <div className="flex min-h-[74px] items-center gap-3 border-b border-border px-4 last:border-b-0" key={index}>
          <Skeleton className="h-[52px] w-[52px] shrink-0 rounded-[11px]" />
          <Skeleton className={`h-[18px] max-w-full ${titleWidths[index % titleWidths.length]}`} />
        </div>
      ))}
    </section>
  );
}