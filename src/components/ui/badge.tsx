import type { ComponentPropsWithoutRef } from "react";
import { joinClasses } from "../classnames";

type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const variantClassNames: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface-2 text-text",
  primary: "border-primary/15 bg-primary-soft text-primary-strong",
  success: "border-success/20 bg-success-soft text-success",
  warning: "border-warning/20 bg-warning-soft text-warning",
  danger: "border-danger/20 bg-danger-soft text-danger",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={joinClasses(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        variantClassNames[variant],
        className,
      )}
    />
  );
}
