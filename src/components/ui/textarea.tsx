import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  hasError?: boolean;
};

export function Textarea({
  className,
  hasError = false,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={hasError || undefined}
      className={joinClasses(
        "w-full rounded-field border bg-surface px-3.5 py-2.5 text-sm text-text shadow-sm transition placeholder:text-[#9a8678] focus:border-primary focus:ring-0 disabled:bg-surface-2 disabled:text-muted",
        hasError ? "border-danger" : "border-border",
        className,
      )}
      rows={rows}
    />
  );
}
