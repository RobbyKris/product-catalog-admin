import type { ReactNode } from "react";
import { joinClasses } from "../classnames";

type TopbarProps = {
  actions?: ReactNode;
  brand?: string;
  className?: string;
  subtitle?: string;
  title?: string;
};

export function Topbar({
  actions,
  brand = "AptaWorks",
  className,
  subtitle = "Product Catalog Admin",
  title = "Catalog Workspace",
}: TopbarProps) {
  return (
    <header
      className={joinClasses(
        "sticky top-0 z-30 border-b border-border/80 bg-[rgba(255,253,249,0.9)] backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {brand}
          </p>
          <div className="mt-1">
            <h1 className="truncate text-base font-semibold text-text">
              {title}
            </h1>
            <p className="truncate text-sm text-muted">{subtitle}</p>
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
