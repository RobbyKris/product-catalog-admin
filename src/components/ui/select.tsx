import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  hasError?: boolean;
  placeholder?: string;
};

function SelectChevron() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-muted"
      viewBox="0 0 20 20"
    >
      <path
        d="m5 7.5 5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function Select({
  children,
  className,
  hasError = false,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        aria-invalid={hasError || undefined}
        className={joinClasses(
          "min-h-10 w-full appearance-none rounded-field border bg-surface px-3.5 py-2 pr-10 text-sm text-text shadow-sm transition focus:border-primary focus:ring-0 disabled:bg-surface-2 disabled:text-muted",
          hasError ? "border-danger" : "border-border",
          className,
        )}
      >
        {placeholder ? (
          <option disabled hidden value="">
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <SelectChevron />
      </div>
    </div>
  );
}
