import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  hasError?: boolean;
};

export function Input({
  className,
  hasError = false,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={hasError || undefined}
      className={joinClasses(
        "min-h-10 w-full rounded-field border bg-surface px-3.5 py-2 text-sm text-text shadow-sm transition placeholder:text-[#9a8678] focus:border-primary focus:ring-0 disabled:bg-surface-2 disabled:text-muted",
        hasError ? "border-danger" : "border-border",
        className,
      )}
    />
  );
}
